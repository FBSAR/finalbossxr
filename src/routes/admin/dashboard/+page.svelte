<script lang="ts">
  import { enhance } from '$app/forms';
  
  export let data;

  let activeTab: 'applications' | 'blogs' = 'applications';
  let showBlogModal = false;
  let editingBlog: any = null;
  let expandedApp: number | null = null;

  // Blog form state
  let blogForm = { title: '', slug: '', excerpt: '', content: '', author: 'FinalBoss XR', published: false, featured: false };

  function openBlogModal(blog?: any) {
    if (blog) {
      editingBlog = blog;
      blogForm = { ...blog };
    } else {
      editingBlog = null;
      blogForm = { title: '', slug: '', excerpt: '', content: '', author: 'FinalBoss XR', published: false, featured: false };
    }
    showBlogModal = true;
  }

  function closeBlogModal() {
    showBlogModal = false;
    editingBlog = null;
  }

  function generateSlug() {
    blogForm.slug = blogForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function confirmDelete(e: MouseEvent, message: string) {
    e.preventDefault();
    if (confirm(message)) {
      const btn = e.currentTarget as HTMLButtonElement;
      btn.form?.submit();
    }
  }
</script>

<svelte:head>
  <title>Admin Dashboard | FinalBoss XR</title>
</svelte:head>

<div class="admin-container">
  <div class="admin-inner">
    <header class="dash-header">
      <div class="header-left">
        <h1 class="gradient-text">⚡ Admin Dashboard</h1>
        <span class="stat">{data.jobApplications.length} Apps • {data.blogs.length} Blogs</span>
      </div>
      <div class="header-right">
        <span class="admin-email">{data.adminEmail}</span>
        <form method="POST" action="?/logout" use:enhance>
          <button type="submit" class="btn-logout">Logout</button>
        </form>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button class:active={activeTab === 'applications'} on:click={() => activeTab = 'applications'}>
        <span class="tab-icon">📋</span>
        <span class="tab-text">Applications</span>
        <span class="tab-count">({data.jobApplications.length})</span>
      </button>
      <button class:active={activeTab === 'blogs'} on:click={() => activeTab = 'blogs'}>
        <span class="tab-icon">📝</span>
        <span class="tab-text">Blogs</span>
        <span class="tab-count">({data.blogs.length})</span>
      </button>
    </div>

    <!-- Applications Tab -->
    {#if activeTab === 'applications'}
      <div class="section">
        {#if data.jobApplications.length === 0}
          <div class="empty-state">No job applications yet</div>
        {:else}
          <!-- Mobile: Card Layout -->
          <div class="app-cards">
            {#each data.jobApplications as app}
              <div class="app-card" class:expanded={expandedApp === app.id}>
                <div class="app-card-header">
                  <div class="app-card-main">
                    <strong class="app-name">{app.name}</strong>
                    <span class="badge">{app.job_title}</span>
                  </div>
                  <div class="app-card-meta">
                    <span class="app-date">{new Date(app.created_at).toLocaleDateString()}</span>
                    {#if app.resume_filename}
                      <a href="/api/resume/{app.id}" class="resume-link" title="View {app.resume_filename}" target="_blank">📄</a>
                    {/if}
                  </div>
                </div>
                <div class="app-card-contact">
                  <a href="mailto:{app.email}">{app.email}</a>
                  {#if app.linkedin}<a href={app.linkedin} target="_blank" class="link-icon">in</a>{/if}
                </div>
                <div class="app-card-actions">
                  <button class="btn-sm btn-expand" on:click={() => expandedApp = expandedApp === app.id ? null : app.id}>
                    {expandedApp === app.id ? '▲ Less' : '▼ More'}
                  </button>
                  <form method="POST" action="?/deleteApplication" use:enhance style="display:inline;">
                    <input type="hidden" name="id" value={app.id} />
                    <button type="submit" class="btn-sm btn-danger" on:click={(e) => confirmDelete(e, 'Delete this application?')}>🗑 Delete</button>
                  </form>
                </div>
                {#if expandedApp === app.id}
                  <div class="app-card-details">
                    <div class="detail-item"><strong>Phone:</strong> {app.phone || '—'}</div>
                    <div class="detail-item"><strong>Portfolio:</strong> {#if app.portfolio}<a href={app.portfolio} target="_blank">{app.portfolio}</a>{:else}—{/if}</div>
                    <div class="detail-item">
                      <strong>Resume:</strong> 
                      {#if app.resume_filename}
                        <a href="/api/resume/{app.id}" class="resume-download-link" target="_blank">📄 View {app.resume_filename}</a>
                      {:else}
                        —
                      {/if}
                    </div>
                    <div class="detail-item full"><strong>Experience:</strong><p>{app.experience}</p></div>
                    <div class="detail-item full"><strong>Why Join:</strong><p>{app.why_join}</p></div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Desktop: Table Layout -->
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each data.jobApplications as app}
                  <tr class:expanded={expandedApp === app.id}>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td class="name-cell">
                      <strong>{app.name}</strong>
                      {#if app.linkedin}<a href={app.linkedin} target="_blank" class="link-icon">in</a>{/if}
                    </td>
                    <td><span class="badge">{app.job_title}</span></td>
                    <td><a href="mailto:{app.email}">{app.email}</a></td>
                    <td>
                      {#if app.resume_filename}
                        <a href="/api/resume/{app.id}" class="resume-download-link" title="View {app.resume_filename}" target="_blank">
                          📄 {app.resume_filename}
                        </a>
                      {:else}
                        —
                      {/if}
                    </td>
                    <td class="actions">
                      <button class="btn-sm" on:click={() => expandedApp = expandedApp === app.id ? null : app.id}>
                        {expandedApp === app.id ? '▲' : '▼'}
                      </button>
                      <form method="POST" action="?/deleteApplication" use:enhance style="display:inline;">
                        <input type="hidden" name="id" value={app.id} />
                        <button type="submit" class="btn-sm btn-danger" on:click={(e) => confirmDelete(e, 'Delete this application?')}>🗑</button>
                      </form>
                    </td>
                  </tr>
                  {#if expandedApp === app.id}
                    <tr class="detail-row">
                      <td colspan="6">
                        <div class="detail-grid">
                          <div><strong>Phone:</strong> {app.phone || '—'}</div>
                          <div><strong>Portfolio:</strong> {#if app.portfolio}<a href={app.portfolio} target="_blank">{app.portfolio}</a>{:else}—{/if}</div>
                          <div>
                            <strong>Resume:</strong>
                            {#if app.resume_filename}
                              <a href="/api/resume/{app.id}" class="resume-download-link" target="_blank">📄 View {app.resume_filename}</a>
                            {:else}
                              —
                            {/if}
                          </div>
                          <div class="full-width"><strong>Experience:</strong><p>{app.experience}</p></div>
                          <div class="full-width"><strong>Why Join:</strong><p>{app.why_join}</p></div>
                        </div>
                      </td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Blogs Tab -->
  {#if activeTab === 'blogs'}
    <div class="section">
      <div class="section-header">
        <button class="btn-primary" on:click={() => openBlogModal()}>+ New Blog</button>
      </div>
      
      {#if data.blogs.length === 0}
        <div class="empty-state">No blogs yet. Create your first post!</div>
      {:else}
        <div class="blog-grid">
          {#each data.blogs as blog}
            <div class="blog-card">
              <div class="blog-meta">
                {#if blog.published}<span class="tag green">Published</span>{:else}<span class="tag">Draft</span>{/if}
                {#if blog.featured}<span class="tag gold">Featured</span>{/if}
              </div>
              <h3>{blog.title}</h3>
              <p class="excerpt">{blog.excerpt || 'No excerpt'}</p>
              <div class="blog-footer">
                <span class="date">{new Date(blog.created_at).toLocaleDateString()}</span>
                <div class="blog-actions">
                  <button class="btn-sm" on:click={() => openBlogModal(blog)}>Edit</button>
                  <form method="POST" action="?/deleteBlog" use:enhance style="display:inline;">
                    <input type="hidden" name="id" value={blog.id} />
                    <button type="submit" class="btn-sm btn-danger" on:click={(e) => confirmDelete(e, 'Delete this blog?')}>🗑</button>
                  </form>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Blog Modal -->
  {#if showBlogModal}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-overlay" role="dialog" aria-modal="true" on:click={closeBlogModal} on:keydown={(e) => e.key === 'Escape' && closeBlogModal()}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="modal" role="document" on:click|stopPropagation on:keydown|stopPropagation>
        <div class="modal-header">
          <h2>{editingBlog ? 'Edit Blog' : 'New Blog'}</h2>
          <button class="close-btn" on:click={closeBlogModal}>×</button>
        </div>
        <form method="POST" action={editingBlog ? '?/updateBlog' : '?/createBlog'} use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === 'success') {
              closeBlogModal();
              await update();
            }
          };
        }}>
          {#if editingBlog}
            <input type="hidden" name="id" value={editingBlog.id} />
          {/if}
          
          <div class="form-row">
            <label for="blog-title">Title</label>
            <input id="blog-title" type="text" name="title" bind:value={blogForm.title} on:blur={generateSlug} required />
          </div>
          
          <div class="form-row">
            <label for="blog-slug">Slug</label>
            <input id="blog-slug" type="text" name="slug" bind:value={blogForm.slug} placeholder="auto-generated" />
          </div>
          
          <div class="form-row">
            <label for="blog-excerpt">Excerpt</label>
            <textarea id="blog-excerpt" name="excerpt" bind:value={blogForm.excerpt} rows="2" placeholder="Short description..."></textarea>
          </div>
          
          <div class="form-row">
            <label for="blog-content">Content (Markdown)</label>
            <textarea id="blog-content" name="content" bind:value={blogForm.content} rows="10" required></textarea>
          </div>
          
          <div class="form-row">
            <label for="blog-author">Author</label>
            <input id="blog-author" type="text" name="author" bind:value={blogForm.author} />
          </div>
          
          <div class="form-row-inline">
            <label><input type="checkbox" name="published" value="true" bind:checked={blogForm.published} /> Published</label>
            <label><input type="checkbox" name="featured" value="true" bind:checked={blogForm.featured} /> Featured</label>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" on:click={closeBlogModal}>Cancel</button>
            <button type="submit" class="btn-primary">{editingBlog ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  </div>
</div>

<style>
  .admin-container {
    min-height: 100vh;
    color: #e0e0e0;
    padding: 1rem;
    background: linear-gradient(180deg, rgba(0, 196, 0, 0.02) 0%, transparent 30%);
  }

  .admin-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 1024px) {
    .admin-container {
      padding: 1.5rem;
    }
    .admin-inner {
      padding: 0;
    }
  }

  /* Header */
  .dash-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(0, 196, 0, 0.15);
    margin-bottom: 1.5rem;
    position: relative;
  }
  .dash-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, #00c400, #9333ea);
    border-radius: 1px;
  }
  .header-left h1 { 
    font-size: 1.125rem; 
    margin: 0;
  }
  .stat { 
    color: #666; 
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .header-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .admin-email {
    color: #00c400;
    font-size: 0.7rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
    padding: 0.35rem 0.75rem;
    background: rgba(0, 196, 0, 0.08);
    border-radius: 2rem;
    border: 1px solid rgba(0, 196, 0, 0.15);
  }
  .btn-logout {
    padding: 0.4rem 0.75rem;
    background: transparent;
    border: 1px solid rgba(255, 100, 100, 0.25);
    border-radius: 0.375rem;
    color: #f87171;
    cursor: pointer;
    font-size: 0.75rem;
    white-space: nowrap;
    transition: all 0.2s ease;
  }
  .btn-logout:hover { 
    background: rgba(255, 100, 100, 0.1); 
    border-color: rgba(255, 100, 100, 0.4);
    color: #fca5a5;
  }

  @media (min-width: 768px) {
    .dash-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .dash-header::after {
      width: 120px;
    }
    .header-left h1 { font-size: 1.35rem; }
    .stat { font-size: 0.75rem; }
    .admin-email { font-size: 0.8rem; max-width: none; }
    .btn-logout { padding: 0.5rem 1rem; font-size: 0.875rem; }
  }

  @media (min-width: 1024px) {
    .header-left h1 { font-size: 1.75rem; }
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    background: rgba(18, 18, 26, 0.8);
    border-radius: 0.75rem;
    border: 1px solid #1a1a24;
  }
  .tabs button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.65rem 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    color: #666;
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 0.8rem;
  }
  .tab-text { display: none; }
  .tab-count { 
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.25rem;
  }
  .tabs button:hover {
    background: rgba(255, 255, 255, 0.03);
    color: #aaa;
  }
  .tabs button.active {
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.15) 0%, rgba(147, 51, 234, 0.08) 100%);
    border-color: rgba(0, 196, 0, 0.3);
    color: #00c400;
    box-shadow: 0 0 20px rgba(0, 196, 0, 0.08);
  }
  .tabs button.active .tab-count {
    background: rgba(0, 196, 0, 0.15);
    color: #00c400;
  }

  @media (min-width: 640px) {
    .tabs button {
      flex: none;
      padding: 0.6rem 1.25rem;
    }
    .tab-text { display: inline; font-weight: 500; }
  }

  /* Section */
  .section { margin-top: 1.25rem; }
  .section-header { margin-bottom: 1rem; }
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #555;
    background: rgba(18, 18, 26, 0.5);
    border-radius: 0.75rem;
    font-size: 0.875rem;
    border: 1px dashed rgba(255, 255, 255, 0.08);
  }

  /* Mobile App Cards */
  .app-cards {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .app-card {
    background: linear-gradient(145deg, #12121a 0%, #0d0d14 100%);
    border: 1px solid #1a1a24;
    border-radius: 0.75rem;
    padding: 1rem;
    transition: all 0.25s ease;
  }
  .app-card:hover {
    border-color: rgba(0, 196, 0, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  .app-card.expanded { 
    border-color: rgba(0, 196, 0, 0.35);
    box-shadow: 0 0 30px rgba(0, 196, 0, 0.05);
  }
  .app-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }
  .app-card-main {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .app-name { font-size: 0.95rem; color: #f0f0f0; }
  .app-card-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 0.7rem;
  }
  .app-card-contact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
  }
  .app-card-actions {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.6rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  .btn-expand { flex: 1; }
  .app-card-details {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 196, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    animation: slideDown 0.2s ease;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .detail-item { font-size: 0.8rem; }
  .detail-item strong { color: #888; }
  .detail-item p { margin: 0.35rem 0 0; color: #aaa; white-space: pre-wrap; }
  .detail-item.full { width: 100%; }

  @media (min-width: 1024px) {
    .app-cards { display: none; }
  }

  /* Desktop Table */
  .table-wrap { 
    display: none;
    overflow-x: auto;
    background: rgba(18, 18, 26, 0.5);
    border-radius: 0.75rem;
    border: 1px solid #1a1a24;
  }
  @media (min-width: 1024px) {
    .table-wrap { display: block; }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  th, td {
    text-align: left;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  th { 
    color: #555; 
    font-weight: 600; 
    font-size: 0.75rem; 
    text-transform: uppercase;
    letter-spacing: 0.03em;
    background: rgba(0, 0, 0, 0.2);
  }
  tr:hover { background: rgba(0, 196, 0, 0.02); }
  .name-cell { display: flex; align-items: center; gap: 0.5rem; }
  .link-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #0077b5, #00a0dc);
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    border-radius: 4px;
    text-decoration: none;
    transition: transform 0.2s ease;
  }
  .link-icon:hover {
    transform: scale(1.1);
  }
  .badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.15) 0%, rgba(0, 196, 0, 0.08) 100%);
    color: #00c400;
    border-radius: 0.375rem;
    font-size: 0.7rem;
    font-weight: 500;
    border: 1px solid rgba(0, 196, 0, 0.2);
  }
  .resume-link {
    text-decoration: none;
    font-size: 1.1rem;
  }
  .resume-link:hover {
    opacity: 0.8;
  }
  .resume-download-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.6rem;
    background: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    text-decoration: none;
    transition: all 0.2s ease;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
  .resume-download-link:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border-color: rgba(59, 130, 246, 0.3);
  }
  .actions { display: flex; gap: 0.35rem; }
  .detail-row td { background: rgba(0, 0, 0, 0.2); padding: 1.25rem; }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    font-size: 0.875rem;
  }
  .detail-grid .full-width { grid-column: 1 / -1; }
  .detail-grid p { margin: 0.5rem 0 0; color: #999; white-space: pre-wrap; }

  /* Buttons */
  .btn-sm {
    padding: 0.35rem 0.7rem;
    background: rgba(26, 26, 36, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.375rem;
    color: #888;
    cursor: pointer;
    font-size: 0.7rem;
    transition: all 0.2s ease;
  }
  .btn-sm:hover { 
    background: rgba(255, 255, 255, 0.05); 
    color: #fff;
    border-color: rgba(255, 255, 255, 0.15);
  }
  .btn-danger { 
    border-color: rgba(239, 68, 68, 0.25);
    color: #f87171;
  }
  .btn-danger:hover { 
    background: rgba(239, 68, 68, 0.1); 
    border-color: rgba(239, 68, 68, 0.4); 
    color: #fca5a5; 
  }
  .btn-primary {
    padding: 0.6rem 1.25rem;
    background: linear-gradient(135deg, #00c400 0%, #00a800 100%);
    border: none;
    border-radius: 0.5rem;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.25s ease;
    box-shadow: 0 2px 10px rgba(0, 196, 0, 0.2);
  }
  .btn-primary:hover { 
    background: linear-gradient(135deg, #00e000 0%, #00c400 100%);
    box-shadow: 0 4px 20px rgba(0, 196, 0, 0.3);
    transform: translateY(-1px);
  }
  .btn-secondary {
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0.5rem;
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.25);
    color: #ccc;
  }

  /* Blog Grid */
  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 640px) {
    .blog-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
  }
  .blog-card {
    padding: 1.25rem;
    background: linear-gradient(145deg, #12121a 0%, #0d0d14 100%);
    border: 1px solid #1a1a24;
    border-radius: 0.75rem;
    transition: all 0.25s ease;
  }
  .blog-card:hover {
    border-color: rgba(147, 51, 234, 0.25);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
  }
  .blog-meta { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
  .tag {
    padding: 0.2rem 0.6rem;
    background: rgba(255, 255, 255, 0.05);
    color: #666;
    border-radius: 0.375rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .tag.green { 
    background: rgba(0, 196, 0, 0.12); 
    color: #00c400;
    border-color: rgba(0, 196, 0, 0.2);
  }
  .tag.gold { 
    background: rgba(255, 215, 0, 0.12); 
    color: #fcd34d;
    border-color: rgba(255, 215, 0, 0.2);
  }
  .blog-card h3 { 
    font-size: 1rem; 
    margin: 0 0 0.6rem;
    color: #f0f0f0;
  }
  .excerpt { 
    color: #666; 
    font-size: 0.8rem; 
    margin: 0; 
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.85rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  .date { color: #555; font-size: 0.75rem; }
  .blog-actions { display: flex; gap: 0.35rem; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 100;
    padding: 0;
  }
  @media (min-width: 640px) {
    .modal-overlay {
      align-items: center;
      padding: 1rem;
    }
  }
  .modal {
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    background: linear-gradient(180deg, #14141e 0%, #0d0d14 100%);
    border: 1px solid rgba(0, 196, 0, 0.15);
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -10px 50px rgba(0, 0, 0, 0.5);
  }
  @media (min-width: 640px) {
    .modal {
      border-radius: 1rem;
      max-height: 85vh;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 196, 0, 0.05);
    }
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    top: 0;
    background: linear-gradient(180deg, #14141e 0%, #12121a 100%);
    z-index: 1;
  }
  .modal-header h2 { 
    margin: 0; 
    font-size: 1.125rem;
    background: linear-gradient(135deg, #00c400, #9333ea);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: #666;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.35rem 0.6rem;
    transition: all 0.2s ease;
  }
  .close-btn:hover {
    background: rgba(255, 100, 100, 0.1);
    border-color: rgba(255, 100, 100, 0.25);
    color: #f87171;
  }
  .modal form { padding: 1.25rem; }
  .form-row { margin-bottom: 1.25rem; }
  .form-row label {
    display: block;
    margin-bottom: 0.4rem;
    color: #888;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: 500;
  }
  .form-row input, .form-row textarea {
    width: 100%;
    padding: 0.7rem 0.85rem;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: #f0f0f0;
    font-size: 1rem;
    transition: all 0.2s ease;
  }
  .form-row input:focus, .form-row textarea:focus {
    outline: none;
    border-color: rgba(0, 196, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(0, 196, 0, 0.1);
  }
  @media (min-width: 640px) {
    .form-row input, .form-row textarea {
      font-size: 0.875rem;
      padding: 0.6rem 0.75rem;
    }
  }
  .form-row textarea { resize: vertical; font-family: inherit; }
  .form-row-inline {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.25rem;
  }
  .form-row-inline label {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #888;
    font-size: 0.875rem;
    cursor: pointer;
    text-transform: none;
    font-weight: 400;
    letter-spacing: 0;
  }
  .form-row-inline input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #00c400;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    bottom: 0;
    background: linear-gradient(180deg, #12121a 0%, #0d0d14 100%);
    padding-bottom: 1rem;
  }

  a { 
    color: #00c400; 
    text-decoration: none;
    transition: color 0.2s ease;
  }
  a:hover { 
    color: #00e000;
    text-decoration: underline; 
  }
</style>
