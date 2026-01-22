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
        <h1>⚡ Admin Dashboard</h1>
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
    background: #0a0a0f;
    color: #e0e0e0;
    padding: 1rem;
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
    padding-bottom: 1rem;
    border-bottom: 1px solid #222;
    margin-bottom: 1rem;
  }
  .header-left h1 { font-size: 1.125rem; margin: 0; }
  .stat { color: #666; font-size: 0.7rem; }
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
  }
  .btn-logout {
    padding: 0.4rem 0.75rem;
    background: transparent;
    border: 1px solid #444;
    border-radius: 0.25rem;
    color: #888;
    cursor: pointer;
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .btn-logout:hover { border-color: #666; color: #fff; }

  @media (min-width: 768px) {
    .dash-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .header-left h1 { font-size: 1.25rem; }
    .stat { font-size: 0.75rem; }
    .admin-email { font-size: 0.8rem; max-width: none; }
    .btn-logout { padding: 0.5rem 1rem; font-size: 0.875rem; }
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .tabs button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.6rem 0.5rem;
    background: #1a1a24;
    border: 1px solid #333;
    border-radius: 0.5rem;
    color: #888;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
  }
  .tab-text { display: none; }
  .tab-count { font-size: 0.7rem; }
  .tabs button.active {
    background: #00c400;
    border-color: #00c400;
    color: #000;
  }

  @media (min-width: 640px) {
    .tabs button {
      flex: none;
      padding: 0.5rem 1rem;
    }
    .tab-text { display: inline; }
  }

  /* Section */
  .section { margin-top: 1rem; }
  .section-header { margin-bottom: 1rem; }
  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: #555;
    background: #12121a;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  /* Mobile App Cards */
  .app-cards {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .app-card {
    background: #12121a;
    border: 1px solid #222;
    border-radius: 0.5rem;
    padding: 0.875rem;
  }
  .app-card.expanded { border-color: #00c400; }
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
  .app-name { font-size: 0.95rem; }
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
    padding-top: 0.5rem;
    border-top: 1px solid #222;
  }
  .btn-expand { flex: 1; }
  .app-card-details {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #333;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
    padding: 0.75rem;
    border-bottom: 1px solid #222;
  }
  th { color: #666; font-weight: 500; font-size: 0.75rem; text-transform: uppercase; }
  tr:hover { background: #12121a; }
  .name-cell { display: flex; align-items: center; gap: 0.5rem; }
  .link-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: #0077b5;
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    border-radius: 3px;
    text-decoration: none;
  }
  .badge {
    display: inline-block;
    padding: 0.2rem 0.4rem;
    background: rgba(0,196,0,0.15);
    color: #00c400;
    border-radius: 0.25rem;
    font-size: 0.7rem;
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
    padding: 0.2rem 0.5rem;
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    text-decoration: none;
    transition: all 0.2s ease;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .resume-download-link:hover {
    background: rgba(59, 130, 246, 0.25);
    color: #93c5fd;
  }
  .actions { display: flex; gap: 0.25rem; }
  .detail-row td { background: #0d0d12; padding: 1rem; }
  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    font-size: 0.875rem;
  }
  .detail-grid .full-width { grid-column: 1 / -1; }
  .detail-grid p { margin: 0.5rem 0 0; color: #aaa; white-space: pre-wrap; }

  /* Buttons */
  .btn-sm {
    padding: 0.3rem 0.6rem;
    background: #1a1a24;
    border: 1px solid #333;
    border-radius: 0.25rem;
    color: #888;
    cursor: pointer;
    font-size: 0.7rem;
  }
  .btn-sm:hover { background: #222; color: #fff; }
  .btn-danger { border-color: #522; }
  .btn-danger:hover { background: #411; border-color: #744; color: #faa; }
  .btn-primary {
    padding: 0.5rem 1rem;
    background: #00c400;
    border: none;
    border-radius: 0.5rem;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.875rem;
  }
  .btn-primary:hover { background: #00e000; }
  .btn-secondary {
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid #444;
    border-radius: 0.5rem;
    color: #888;
    cursor: pointer;
  }

  /* Blog Grid */
  .blog-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 640px) {
    .blog-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
  }
  .blog-card {
    padding: 1rem;
    background: #12121a;
    border: 1px solid #222;
    border-radius: 0.5rem;
  }
  .blog-meta { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
  .tag {
    padding: 0.125rem 0.5rem;
    background: #222;
    color: #666;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    text-transform: uppercase;
  }
  .tag.green { background: rgba(0,196,0,0.2); color: #0c0; }
  .tag.gold { background: rgba(255,215,0,0.2); color: #fc0; }
  .blog-card h3 { font-size: 1rem; margin: 0 0 0.5rem; }
  .excerpt { color: #666; font-size: 0.8rem; margin: 0; line-height: 1.4; }
  .blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #222;
  }
  .date { color: #555; font-size: 0.75rem; }
  .blog-actions { display: flex; gap: 0.25rem; }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
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
    background: #12121a;
    border: 1px solid #333;
    border-radius: 0.75rem 0.75rem 0 0;
  }
  @media (min-width: 640px) {
    .modal {
      border-radius: 0.75rem;
      max-height: 85vh;
    }
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #222;
    position: sticky;
    top: 0;
    background: #12121a;
    z-index: 1;
  }
  .modal-header h2 { margin: 0; font-size: 1.125rem; }
  .close-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem;
  }
  .modal form { padding: 1rem; }
  .form-row { margin-bottom: 1rem; }
  .form-row label {
    display: block;
    margin-bottom: 0.25rem;
    color: #888;
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .form-row input, .form-row textarea {
    width: 100%;
    padding: 0.6rem;
    background: #1a1a24;
    border: 1px solid #333;
    border-radius: 0.25rem;
    color: #fff;
    font-size: 1rem;
  }
  @media (min-width: 640px) {
    .form-row input, .form-row textarea {
      font-size: 0.875rem;
      padding: 0.5rem;
    }
  }
  .form-row textarea { resize: vertical; font-family: inherit; }
  .form-row-inline {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  .form-row-inline label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #888;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #222;
    position: sticky;
    bottom: 0;
    background: #12121a;
    padding-bottom: 1rem;
  }

  a { color: #00c400; text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
