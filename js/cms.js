document.addEventListener('DOMContentLoaded', async () => {
  const blogGrid = document.getElementById('blog-grid');
  
  if (blogGrid && window.supabaseClient) {
    try {
      // Attempt to fetch blogs from Supabase
      const { data: blogs, error } = await window.supabaseClient
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      
      // If we have dynamic blogs, render them and replace static content
      if (blogs && blogs.length > 0) {
        blogGrid.innerHTML = ''; // Clear hardcoded HTML
        
        blogs.forEach((blog, index) => {
          const article = document.createElement('article');
          article.className = 'blog-card';
          article.setAttribute('data-animate', '');
          
          const icon = blog.icon || (index % 3 === 0 ? 'sun' : index % 3 === 1 ? 'battery-charging' : 'bar-chart');
          
          article.innerHTML = `
            <div class="blog-image">
              <!-- Using standard gradients or an image URL if provided in CMS -->
              <div style="position:absolute;inset:0;background:var(--gradient-solar);opacity:0.8;"></div>
              <i data-lucide="${icon}" style="position:relative;z-index:2;color:white;width:48px;height:48px;"></i>
            </div>
            <div class="blog-content">
              <span class="blog-category">${blog.category || 'News'}</span>
              <h3 class="blog-title">${blog.title}</h3>
              <p class="blog-excerpt">${blog.excerpt || ''}</p>
              <a href="#" class="btn-text">
                Read More <i data-lucide="arrow-right"></i>
              </a>
            </div>
          `;
          
          blogGrid.appendChild(article);
        });
        
        if (window.lucide) {
          window.lucide.createIcons({ root: blogGrid });
        }
      }
    } catch (err) {
      // Supabase table 'blogs' might not exist yet or keys are missing.
      // Silently fail and let the hardcoded HTML remain as a fallback.
      console.log('CMS mode inactive. Falling back to static blog cards.');
    }
  }
});
