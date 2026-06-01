import { NextResponse } from 'next/server';

// State-level average electricity rates ($/kWh) — fallback if the API doesn't provide one
const STATE_RATES = {
  AL: 0.14, AK: 0.23, AZ: 0.13, AR: 0.12, CA: 0.28, CO: 0.14, CT: 0.27,
  DE: 0.14, FL: 0.14, GA: 0.13, HI: 0.43, ID: 0.11, IL: 0.16, IN: 0.15,
  IA: 0.14, KS: 0.14, KY: 0.12, LA: 0.11, ME: 0.23, MD: 0.16, MA: 0.27,
  MI: 0.18, MN: 0.15, MS: 0.13, MO: 0.13, MT: 0.12, NE: 0.12, NV: 0.14,
  NH: 0.23, NJ: 0.18, NM: 0.14, NY: 0.22, NC: 0.12, ND: 0.12, OH: 0.14,
  OK: 0.11, OR: 0.12, PA: 0.17, RI: 0.27, SC: 0.14, SD: 0.13, TN: 0.12,
  TX: 0.13, UT: 0.11, VT: 0.21, VA: 0.13, WA: 0.11, WV: 0.13, WI: 0.16,
  WY: 0.11, DC: 0.15
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: 'Invalid ZIP code. Please provide a 5-digit US ZIP code.' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Convert ZIP → lat/lon using Zippopotam.us (free, no API key)
    const geoRes = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!geoRes.ok) {
      return NextResponse.json(
        { error: `ZIP code ${zip} not found. Please enter a valid US ZIP code.` },
        { status: 404 }
      );
    }

    const geoData = await geoRes.json();
    const place = geoData.places?.[0];
    if (!place) {
      return NextResponse.json({ error: 'Could not resolve location.' }, { status: 404 });
    }

    const lat = parseFloat(place.latitude);
    const lon = parseFloat(place.longitude);
    const city = place['place name'];
    const stateAbbr = place['state abbreviation'];

    // Step 2: Call NREL PVWatts API v8
    const apiKey = process.env.NREL_API_KEY || 'DEMO_KEY';
    const pvWattsUrl = new URL('https://developer.nrel.gov/api/pvwatts/v8.json');
    pvWattsUrl.searchParams.set('api_key', apiKey);
    pvWattsUrl.searchParams.set('lat', lat.toString());
    pvWattsUrl.searchParams.set('lon', lon.toString());
    pvWattsUrl.searchParams.set('system_capacity', '4');    // 4kW reference system
    pvWattsUrl.searchParams.set('module_type', '1');         // Premium
    pvWattsUrl.searchParams.set('array_type', '1');          // Fixed Roof Mount
    pvWattsUrl.searchParams.set('tilt', '20');
    pvWattsUrl.searchParams.set('azimuth', '180');
    pvWattsUrl.searchParams.set('losses', '14');

    const pvRes = await fetch(pvWattsUrl.toString(), {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!pvRes.ok) {
      // If PVWatts fails, return a fallback with just geo + state rate
      const fallbackRate = STATE_RATES[stateAbbr] || 0.15;
      return NextResponse.json({
        zip,
        city,
        state: stateAbbr,
        lat,
        lon,
        avg_sun_hours: 5.0,
        annual_kwh_per_kw: 1400,
        electricity_rate: fallbackRate,
        source: 'fallback'
      });
    }

    const pvData = await pvRes.json();
    const outputs = pvData.outputs;

    // Calculate average sun hours from the solrad_annual (avg daily solar radiation kWh/m²/day)
    // PVWatts provides ac_annual for a 4kW system
    const annualKwh = outputs?.ac_annual || 0;
    const annualKwhPerKw = annualKwh / 4; // Normalize per kW
    const solradAnnual = outputs?.solrad_annual || 5.0; // avg daily solar radiation

    const electricityRate = STATE_RATES[stateAbbr] || 0.15;

    return NextResponse.json({
      zip,
      city,
      state: stateAbbr,
      lat,
      lon,
      avg_sun_hours: parseFloat(solradAnnual.toFixed(1)),
      annual_kwh_per_kw: Math.round(annualKwhPerKw),
      electricity_rate: electricityRate,
      source: 'nrel_pvwatts'
    });

  } catch (err) {
    console.error('Solar estimate API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch solar data. Please try again.' },
      { status: 500 }
    );
  }
}
