<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  
  export let data;
  export let form;

  let activeTab: 'applications' | 'blogs' | 'newsletter' | 'jobs' = 'applications';
  let showBlogModal = false;
  let editingBlog: any = null;
  let expandedApp: number | null = null;
  
  // Loading state
  let isSubmitting = false;
  let deletingIds: Set<string | number> = new Set();
  
  // Jobs state
  let showJobModal = false;
  let editingJob: any = null;
  let jobForm = { title: '', department: '', job_type: '', location: 'Remote', summary: '', description: '', published: true };
  
  // Newsletter state
  let showDraftModal = false;
  let editingDraft: any = null;
  let draftForm = { subject: '', content: '', status: 'draft', scheduled_at: '' };
  let sendingNewsletterIds: Set<number> = new Set();
  let testingNewsletterIds: Set<number> = new Set();
  
  // Local reactive copies — allow optimistic updates without waiting for server round-trip
  let subscribers = data.subscribers;
  $: subscribers = data.subscribers;

  let blogs = data.blogs;
  $: blogs = data.blogs;
  
  // Section collapsed states
  let subscribersExpanded = true;
  let draftsExpanded = true;
  let archivedExpanded = false;
  let markdownHelpExpanded = false;
  let emailMarkdownHelpExpanded = false;
  let archivedPage = 1;
  const ARCHIVED_PER_PAGE = 30;
  
  $: archivedTotalPages = Math.ceil(data.archivedNewsletters.length / ARCHIVED_PER_PAGE);
  $: paginatedArchived = data.archivedNewsletters.slice(
    (archivedPage - 1) * ARCHIVED_PER_PAGE,
    archivedPage * ARCHIVED_PER_PAGE
  );
  
  // Toast state
  let toast: { message: string; type: 'success' | 'error' } | null = null;
  
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    toast = { message, type };
    setTimeout(() => toast = null, 4000);
  }
  
  // Show toast when form returns error
  $: if (form?.error && form?.message) {
    showToast(form.message, 'error');
  }

  // Confirmation modal state
  let showConfirmModal = false;
  let confirmModalMessage = '';
  let confirmModalAction: (() => void) | null = null;
  let confirmModalType: 'danger' | 'warning' = 'danger';

  function openConfirmModal(message: string, action: () => void, type: 'danger' | 'warning' = 'danger') {
    confirmModalMessage = message;
    confirmModalAction = action;
    confirmModalType = type;
    showConfirmModal = true;
  }

  function closeConfirmModal() {
    showConfirmModal = false;
    confirmModalMessage = '';
    confirmModalAction = null;
  }

  function executeConfirmAction() {
    if (confirmModalAction) {
      confirmModalAction();
    }
    closeConfirmModal();
  }

  // Blog form state
  let blogForm = { title: '', slug: '', excerpt: '', content: '', feature_image_url: '', published: false, featured: false };

  function openBlogModal(blog?: any) {
    if (blog) {
      editingBlog = blog;
      blogForm = { ...blog };
    } else {
      editingBlog = null;
      blogForm = { title: '', slug: '', excerpt: '', content: '', feature_image_url: '', published: false, featured: false };
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

  // Job modal functions
  function openJobModal(job?: any) {
    if (job) {
      editingJob = job;
      jobForm = { ...job };
    } else {
      editingJob = null;
      jobForm = { title: '', department: '', job_type: '', location: 'Remote', summary: '', description: '', published: true };
    }
    showJobModal = true;
  }

  function closeJobModal() {
    showJobModal = false;
    editingJob = null;
  }

  // Newsletter draft functions
  function openDraftModal(draft?: any) {
    if (draft) {
      editingDraft = draft;
      draftForm = { 
        subject: draft.subject, 
        content: draft.content, 
        status: draft.status,
        scheduled_at: draft.scheduled_at ? new Date(draft.scheduled_at).toISOString().slice(0, 16) : ''
      };
    } else {
      editingDraft = null;
      draftForm = { subject: '', content: '', status: 'draft', scheduled_at: '' };
    }
    showDraftModal = true;
  }

  function closeDraftModal() {
    showDraftModal = false;
    editingDraft = null;
  }

  function confirmDelete(e: MouseEvent, message: string) {
    e.preventDefault();
    const btn = e.currentTarget as HTMLButtonElement;
    
    openConfirmModal(message, () => {
      // Use requestSubmit() to trigger the enhance callback instead of native submit
      btn.form?.requestSubmit(btn);
    }, 'danger');
  }

  // Application Response State
  let showApplicationResponseModal = false;
  let selectedApplication: any = null;
  let responseForm = { customMessage: '', status: '' };
  let isRespondingToApplication = false;

  // Preset Messages State
  let showPresetMessagesModal = false;
  let presetMessages: Record<string, any> = {
    acceptance: { message: "", next_steps: "" },
    rejection: { message: "", next_steps: "" }
  };
  let isLoadingTemplates = false;
  let isSavingTemplates = false;

  // Load response templates from database on mount
  onMount(async () => {
    isLoadingTemplates = true;
    try {
      const response = await fetch('/api/response-templates?all=true');
      const data = await response.json();
      if (data.success && data.templates) {
        for (const template of data.templates) {
          presetMessages[template.template_type] = {
            message: template.message,
            next_steps: template.next_steps || ""
          };
        }
      }
    } catch (error) {
      console.error('Error loading response templates:', error);
      showToast('Failed to load response templates', 'error');
    } finally {
      isLoadingTemplates = false;
    }
  });

  // Disable scrollbar when any modal is open
  $: if (typeof document !== 'undefined') {
    const isAnyModalOpen = showBlogModal || showJobModal || showDraftModal || showApplicationResponseModal || showPresetMessagesModal;
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'auto';
  }

  function openPresetMessagesModal() {
    showPresetMessagesModal = true;
  }

  function closePresetMessagesModal() {
    showPresetMessagesModal = false;
  }

  async function savePresetMessages() {
    isSavingTemplates = true;
    try {
      // Save acceptance template
      const acceptanceRes = await fetch('/api/response-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'acceptance',
          title: 'Acceptance Message',
          message: presetMessages.acceptance.message
        })
      });

      if (!acceptanceRes.ok) throw new Error('Failed to save acceptance template');

      // Save rejection template
      const rejectionRes = await fetch('/api/response-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'rejection',
          title: 'Rejection Message',
          message: presetMessages.rejection.message
        })
      });

      if (!rejectionRes.ok) throw new Error('Failed to save rejection template');

      showToast('Response templates saved successfully', 'success');
      closePresetMessagesModal();
    } catch (error) {
      console.error('Error saving response templates:', error);
      showToast('Failed to save response templates', 'error');
    } finally {
      isSavingTemplates = false;
    }
  }

  function openApplicationResponseModal(app: any, status: 'accepted' | 'rejected') {
    selectedApplication = app;
    
    // Map 'accepted'/'rejected' to 'acceptance'/'rejection' to match template keys
    const templateType = status === 'accepted' ? 'acceptance' : 'rejection';
    
    responseForm = { 
      customMessage: presetMessages[templateType]?.message || '', 
      status 
    };
    showApplicationResponseModal = true;
  }

  function closeApplicationResponseModal() {
    showApplicationResponseModal = false;
    selectedApplication = null;
    responseForm = { customMessage: '', status: '' };
  }

  async function submitApplicationResponse() {
    if (!responseForm.customMessage.trim()) {
      showToast('Please provide a message', 'error');
      return;
    }

    isRespondingToApplication = true;
    const formData = new FormData();
    formData.append('applicationId', selectedApplication.id);
    formData.append('status', responseForm.status);
    formData.append('customMessage', responseForm.customMessage);

    try {
      const response = await fetch('?/respondToApplication', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.type === 'success') {
        showToast(result.data?.message || `Application ${responseForm.status}!`, 'success');
        closeApplicationResponseModal();
        // Optionally reload the page to see updated status
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast(result.data?.message || 'Failed to respond to application', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
      console.error(error);
    } finally {
      isRespondingToApplication = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Dashboard | FinalBoss XR</title>
</svelte:head>

<div class="admin-container">
  <!-- Loading Spinner Overlay -->
  {#if isSubmitting}
    <div class="loading-overlay">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p class="spinner-text">Saving...</p>
      </div>
    </div>
  {/if}

  <!-- Toast Notification -->
  {#if toast}
    <div class="toast" class:error={toast.type === 'error'} class:success={toast.type === 'success'}>
      <span class="toast-icon">
        {#if toast.type === 'error'}⚠️{:else}✓{/if}
      </span>
      <span class="toast-message">{toast.message}</span>
      <button class="toast-close" on:click={() => toast = null}>×</button>
    </div>
  {/if}
  
  <div class="admin-inner">
    <header class="dash-header">
      <div class="header-left">
        <h1 class="gradient-text">⚡ Admin Dashboard</h1>
        <span class="stat">{data.jobApplications.length} Apps • {blogs.length} Blogs • {subscribers.length} Subscribers</span>
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
      <button class:active={activeTab === 'jobs'} on:click={() => activeTab = 'jobs'}>
        <span class="tab-icon">💼</span>
        <span class="tab-text">Jobs</span>
        <span class="tab-count">({data.jobs.length})</span>
      </button>
      <button class:active={activeTab === 'blogs'} on:click={() => activeTab = 'blogs'}>
        <span class="tab-icon">📝</span>
        <span class="tab-text">Blogs</span>
        <span class="tab-count">({blogs.length})</span>
      </button>
      <button class:active={activeTab === 'newsletter'} on:click={() => activeTab = 'newsletter'}>
        <span class="tab-icon">📧</span>
        <span class="tab-text">Newsletter</span>
        <span class="tab-count">({subscribers.length})</span>
      </button>
    </div>

    <!-- Applications Tab -->
    {#if activeTab === 'applications'}
      <div class="section">
        <div class="section-header">
          <h2 style="margin: 0;">Job Applications</h2>
          <button class="btn-secondary btn-sm" on:click={openPresetMessagesModal} title="Manage response message templates">
            ⚙️ Response Templates
          </button>
        </div>
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
                  <div class="app-status">
                    {#if app.status === 'pending'}
                      <span class="status-badge pending">Pending</span>
                    {:else if app.status === 'accepted'}
                      <span class="status-badge accepted">✓ Accepted</span>
                    {:else if app.status === 'rejected'}
                      <span class="status-badge rejected">✗ Rejected</span>
                    {/if}
                  </div>
                  {#if app.status === 'pending'}
                    <button class="btn-sm btn-success" on:click={() => openApplicationResponseModal(app, 'accepted')}>👍 Accept</button>
                    <button class="btn-sm btn-warning" on:click={() => openApplicationResponseModal(app, 'rejected')}>👎 Reject</button>
                  {/if}
                  <button class="btn-sm btn-expand" on:click={() => expandedApp = expandedApp === app.id ? null : app.id}>
                    {expandedApp === app.id ? '▲ Less' : '▼ More'}
                  </button>
                  <form method="POST" action="?/deleteApplication" use:enhance={() => {
                    return async ({ result, update }) => {
                      if (result.type === 'success') {
                        showToast('Application deleted successfully', 'success');
                        await update();
                      } else if (result.type === 'failure' || result.type === 'error') {
                        showToast('Failed to delete application', 'error');
                      }
                    };
                  }} style="display:inline;">
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
                      {#if app.status === 'pending'}
                        <span class="status-badge-small pending">Pending</span>
                      {:else if app.status === 'accepted'}
                        <span class="status-badge-small accepted">✓ Accepted</span>
                      {:else if app.status === 'rejected'}
                        <span class="status-badge-small rejected">✗ Rejected</span>
                      {/if}
                      {#if app.status === 'pending'}
                        <button class="btn-xs" title="Accept" on:click={() => openApplicationResponseModal(app, 'accepted')}>✓</button>
                        <button class="btn-xs" title="Reject" on:click={() => openApplicationResponseModal(app, 'rejected')}>✗</button>
                      {/if}
                      <button class="btn-sm" on:click={() => expandedApp = expandedApp === app.id ? null : app.id}>
                        {expandedApp === app.id ? '▲' : '▼'}
                      </button>
                      <form method="POST" action="?/deleteApplication" use:enhance={() => {
                        return async ({ result, update }) => {
                          if (result.type === 'success') {
                            showToast('Application deleted successfully', 'success');
                            await update();
                          } else if (result.type === 'failure' || result.type === 'error') {
                            showToast('Failed to delete application', 'error');
                          }
                        };
                      }} style="display:inline;">
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
      
      {#if blogs.length === 0}
        <div class="empty-state">No blogs yet. Create your first post!</div>
      {:else}
        <div class="blog-grid">
          {#each blogs as blog}
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
                  {#if !blog.published}
                    <a href="/blog/draft/{blog.slug}?t={Date.now()}" target="_blank" class="btn-sm" style="text-decoration:none;display:inline-block;">👁 Preview</a>
                  {/if}
                  <button class="btn-sm" on:click={() => openBlogModal(blog)}>Edit</button>
                  <form method="POST" action="?/deleteBlog" use:enhance={() => {
                    return async ({ result, update, formData }) => {
                      const blogId = String(blog.id);
                      deletingIds.add(blogId);
                      deletingIds = deletingIds;
                      
                      if (result.type === 'success') {
                        showToast('Blog deleted successfully', 'success');
                        await update();
                        // Keep spinner visible until item is actually gone from the list
                        // The update() re-fetches data, so the item should be gone now
                        deletingIds.delete(blogId);
                        deletingIds = deletingIds;
                      } else if (result.type === 'failure' || result.type === 'error') {
                        showToast('Failed to delete blog', 'error');
                        await update();
                        deletingIds.delete(blogId);
                        deletingIds = deletingIds;
                      }
                    };
                  }} style="display:inline;">
                    <input type="hidden" name="id" value={blog.id} />
                    <button type="submit" class="btn-sm btn-danger" disabled={deletingIds.has(String(blog.id))} on:click={(e) => confirmDelete(e, 'Delete this blog?')}>
                      {#if deletingIds.has(String(blog.id))}
                        <span class="btn-spinner"></span>
                      {:else}
                        🗑
                      {/if}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Jobs Tab -->
  {#if activeTab === 'jobs'}
    <div class="section">
      <div class="section-header">
        <button class="btn-primary" on:click={() => openJobModal()}>+ New Job</button>
      </div>
      
      {#if data.jobs.length === 0}
        <div class="empty-state">No jobs posted yet. Create your first opening!</div>
      {:else}
        <div class="jobs-list">
          {#each data.jobs as job}
            <div class="job-card admin-view">
              <div class="job-meta">
                {#if job.published}<span class="tag green">Published</span>{:else}<span class="tag">Draft</span>{/if}
              </div>
              <div class="job-header">
                <div>
                  <h3>{job.title}</h3>
                  <div class="job-info">
                    <span class="department">{job.department}</span>
                    <span class="job-type">{job.job_type}</span>
                    <span class="location">{job.location}</span>
                  </div>
                </div>
              </div>
              <p class="description">{job.summary}</p>
              <div class="job-actions">
                <button class="btn-sm" on:click={() => openJobModal(job)}>Edit</button>
                <form method="POST" action="?/deleteJob" use:enhance={() => {
                  return async ({ result, update, formData }) => {
                    const jobId = String(job.id);
                    deletingIds.add(jobId);
                    deletingIds = deletingIds;
                    
                    if (result.type === 'success') {
                      showToast('Job deleted successfully', 'success');
                      await update();
                      // Keep spinner visible until item is actually gone from the list
                      // The update() re-fetches data, so the item should be gone now
                      deletingIds.delete(jobId);
                      deletingIds = deletingIds;
                    } else if (result.type === 'failure' || result.type === 'error') {
                      showToast('Failed to delete job', 'error');
                      await update();
                      deletingIds.delete(jobId);
                      deletingIds = deletingIds;
                    }
                  };
                }} style="display:inline;">
                  <input type="hidden" name="id" value={job.id} />
                  <button type="submit" class="btn-sm btn-danger" disabled={deletingIds.has(String(job.id))} on:click={(e) => confirmDelete(e, 'Delete this job?')}>
                    {#if deletingIds.has(String(job.id))}
                      <span class="btn-spinner"></span>
                    {:else}
                      🗑
                    {/if}
                  </button>
                </form>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Newsletter Tab -->
  {#if activeTab === 'newsletter'}
    <div class="section newsletter-section stacked">
      <!-- Subscribers Section -->
      <div class="newsletter-panel" class:collapsed={!subscribersExpanded}>
        <button class="panel-header collapsible-header" on:click={() => subscribersExpanded = !subscribersExpanded}>
          <div class="header-left-content">
            <span class="collapse-icon" class:expanded={subscribersExpanded}>{subscribersExpanded ? '▼' : '▶'}</span>
            <h2>📧 Email Subscribers</h2>
          </div>
          <span class="subscriber-count">{subscribers.length} subscribers</span>
        </button>
        
        {#if subscribersExpanded}
          {#if subscribers.length === 0}
            <div class="empty-state">No subscribers yet</div>
          {:else}
            <div class="subscribers-list">
              {#each subscribers as sub}
                <div class="subscriber-card">
                  <div class="subscriber-info">
                    <span class="subscriber-email">{sub.email}</span>
                    {#if sub.name}<span class="subscriber-name">{sub.name}</span>{/if}
                    <span class="subscriber-meta">
                      <span class="source-badge">{sub.source || 'website'}</span>
                      <span class="sub-date">{new Date(sub.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <form method="POST" action="?/deleteSubscriber" use:enhance={({ formData }) => {
                    const deletedId = Number(formData.get('id'));
                    return async ({ result }) => {
                      if (result.type === 'success') {
                        // Update local state without page reload
                        subscribers = subscribers.filter(s => s.id !== deletedId);
                        showToast('Subscriber removed', 'success');
                      } else {
                        showToast('Failed to remove subscriber', 'error');
                      }
                    };
                  }}>
                    <input type="hidden" name="id" value={sub.id} />
                    <button type="submit" class="btn-sm btn-danger" on:click={(e) => confirmDelete(e, 'Remove this subscriber?')}>🗑</button>
                  </form>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </div>

      <!-- Drafts Section -->
      <div class="newsletter-panel" class:collapsed={!draftsExpanded}>
        <div class="panel-header collapsible-header">
          <button class="header-toggle" on:click={() => draftsExpanded = !draftsExpanded}>
            <span class="collapse-icon" class:expanded={draftsExpanded}>{draftsExpanded ? '▼' : '▶'}</span>
            <h2>📝 Newsletter Drafts</h2>
            <span class="draft-count-badge">{data.newsletterDrafts.length}</span>
          </button>
          <button class="btn-primary btn-sm-header" on:click|stopPropagation={() => openDraftModal()}>+ New Draft</button>
        </div>
        
        {#if draftsExpanded}
          {#if data.newsletterDrafts.length === 0}
            <div class="empty-state">No drafts yet. Create your first newsletter!</div>
          {:else}
            <div class="drafts-list">
              {#each data.newsletterDrafts as draft}
                <div class="draft-card">
                  <div class="draft-header">
                    <h3>{draft.subject}</h3>
                    <div class="draft-status">
                      {#if draft.status === 'draft'}
                        <span class="tag">Draft</span>
                      {:else if draft.status === 'scheduled'}
                        <span class="tag blue">Scheduled</span>
                      {:else if draft.status === 'sent'}
                        <span class="tag green">Sent</span>
                      {/if}
                    </div>
                  </div>
                <p class="draft-preview">{draft.content.substring(0, 100)}{draft.content.length > 100 ? '...' : ''}</p>
                <div class="draft-meta">
                  {#if draft.scheduled_at}
                    <span class="scheduled-time">📅 {new Date(draft.scheduled_at).toLocaleString()}</span>
                  {/if}
                  {#if draft.sent_at}
                    <span class="sent-time">✓ Sent: {new Date(draft.sent_at).toLocaleString()}</span>
                  {/if}
                  <span class="draft-date">Created: {new Date(draft.created_at).toLocaleDateString()}</span>
                </div>
                <div class="draft-actions">
                  {#if draft.status !== 'sent'}
                    <form method="POST" action="?/sendTestNewsletter" use:enhance={() => {
                      testingNewsletterIds.add(draft.id);
                      testingNewsletterIds = testingNewsletterIds;
                      return async ({ result, update }) => {
                        testingNewsletterIds.delete(draft.id);
                        testingNewsletterIds = testingNewsletterIds;
                        if (result.type === 'success') {
                          // @ts-ignore
                          showToast(result.data?.message || 'Test email sent!', 'success');
                        } else {
                          // @ts-ignore
                          showToast(result.data?.message || 'Failed to send test email', 'error');
                        }
                      };
                    }} style="display:inline;">
                      <input type="hidden" name="id" value={draft.id} />
                      <button 
                        type="submit" 
                        class="btn-sm btn-test" 
                        class:sending={testingNewsletterIds.has(draft.id)}
                        disabled={testingNewsletterIds.has(draft.id)}
                      >
                        {#if testingNewsletterIds.has(draft.id)}
                          <span class="spinner"></span> Testing...
                        {:else}
                          🧪 Test
                        {/if}
                      </button>
                    </form>
                    <form method="POST" action="?/sendNewsletter" use:enhance={() => {
                      sendingNewsletterIds.add(draft.id);
                      sendingNewsletterIds = sendingNewsletterIds;
                      return async ({ result, update }) => {
                        sendingNewsletterIds.delete(draft.id);
                        sendingNewsletterIds = sendingNewsletterIds;
                        if (result.type === 'success') {
                          // @ts-ignore
                          showToast(result.data?.message || 'Newsletter sent!', 'success');
                          await update();
                        } else {
                          // @ts-ignore
                          showToast(result.data?.message || 'Failed to send newsletter', 'error');
                        }
                      };
                    }} style="display:inline;">
                      <input type="hidden" name="id" value={draft.id} />
                      <button 
                        type="submit" 
                        class="btn-sm btn-send" 
                        class:sending={sendingNewsletterIds.has(draft.id)}
                        disabled={sendingNewsletterIds.has(draft.id)}
                        on:click={(e) => !sendingNewsletterIds.has(draft.id) && confirmDelete(e, `Send this newsletter to ${subscribers.length} subscribers?`)}
                      >
                        {#if sendingNewsletterIds.has(draft.id)}
                          <span class="spinner"></span> Sending...
                        {:else}
                          📤 Send
                        {/if}
                      </button>
                    </form>
                  {:else}
                    <form method="POST" action="?/archiveNewsletter" use:enhance={() => {
                      return async ({ result, update }) => {
                        if (result.type === 'success') {
                          showToast('Newsletter archived', 'success');
                          await update();
                        } else {
                          showToast('Failed to archive', 'error');
                        }
                      };
                    }} style="display:inline;">
                      <input type="hidden" name="id" value={draft.id} />
                      <button type="submit" class="btn-sm btn-archive">📥 Archive</button>
                    </form>
                  {/if}
                  <button class="btn-sm" on:click={() => openDraftModal(draft)}>Edit</button>
                  <form method="POST" action="?/deleteDraft" use:enhance={() => {
                    return async ({ result, update }) => {
                      if (result.type === 'success') {
                        showToast('Draft deleted', 'success');
                        await update();
                      } else {
                        showToast('Failed to delete draft', 'error');
                      }
                    };
                  }} style="display:inline;">
                    <input type="hidden" name="id" value={draft.id} />
                    <button type="submit" class="btn-sm btn-danger" on:click={(e) => confirmDelete(e, 'Delete this draft?')}>🗑</button>
                  </form>
                </div>
              </div>
            {/each}
          </div>
        {/if}
        {/if}
      </div>

      <!-- Archived Newsletters Section -->
      <div class="newsletter-panel archived-panel" class:collapsed={!archivedExpanded}>
        <button class="panel-header collapsible-header" on:click={() => archivedExpanded = !archivedExpanded}>
          <div class="header-left-content">
            <span class="collapse-icon" class:expanded={archivedExpanded}>{archivedExpanded ? '▼' : '▶'}</span>
            <h2>📦 Archived Newsletters</h2>
          </div>
          <span class="archived-count">{data.archivedNewsletters.length} archived</span>
        </button>
        
        {#if archivedExpanded}
          {#if data.archivedNewsletters.length === 0}
            <div class="empty-state">No archived newsletters</div>
          {:else}
            <div class="drafts-list">
              {#each paginatedArchived as newsletter}
                <div class="draft-card archived-card">
                  <div class="draft-header">
                    <h3>{newsletter.subject}</h3>
                    <div class="draft-status">
                      <span class="tag gray">Archived</span>
                      {#if newsletter.recipient_count}
                        <span class="recipient-badge">👥 {newsletter.recipient_count}</span>
                      {/if}
                    </div>
                  </div>
                  <p class="draft-preview">{newsletter.content.substring(0, 100)}{newsletter.content.length > 100 ? '...' : ''}</p>
                  <div class="draft-meta">
                    {#if newsletter.sent_at}
                      <span class="sent-time">✓ Sent: {new Date(newsletter.sent_at).toLocaleString()}</span>
                    {/if}
                  </div>
                  <div class="draft-actions">
                    <form method="POST" action="?/unarchiveNewsletter" use:enhance={() => {
                      return async ({ result, update }) => {
                        if (result.type === 'success') {
                          showToast('Newsletter restored', 'success');
                          await update();
                        } else {
                          showToast('Failed to restore', 'error');
                        }
                      };
                    }} style="display:inline;">
                      <input type="hidden" name="id" value={newsletter.id} />
                      <button type="submit" class="btn-sm btn-restore">↩ Restore</button>
                    </form>
                    <button class="btn-sm" on:click={() => openDraftModal(newsletter)}>View</button>
                    <form method="POST" action="?/deleteDraft" use:enhance={() => {
                      return async ({ result, update }) => {
                        if (result.type === 'success') {
                          showToast('Newsletter deleted', 'success');
                          await update();
                        } else {
                          showToast('Failed to delete', 'error');
                        }
                      };
                    }} style="display:inline;">
                      <input type="hidden" name="id" value={newsletter.id} />
                      <button type="submit" class="btn-sm btn-danger" on:click={(e) => confirmDelete(e, 'Permanently delete this newsletter?')}>🗑</button>
                    </form>
                  </div>
                </div>
              {/each}
            </div>
            
            <!-- Pagination Controls -->
            {#if archivedTotalPages > 1}
              <div class="pagination">
                <button 
                  class="pagination-btn" 
                  disabled={archivedPage === 1}
                  on:click={() => archivedPage--}
                >
                  ← Prev
                </button>
                <span class="pagination-info">
                  Page {archivedPage} of {archivedTotalPages}
                </span>
                <button 
                  class="pagination-btn" 
                  disabled={archivedPage === archivedTotalPages}
                  on:click={() => archivedPage++}
                >
                  Next →
                </button>
              </div>
            {/if}
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Draft Modal -->
  {#if showDraftModal}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-overlay" role="dialog" aria-modal="true" on:click={closeDraftModal} on:keydown={(e) => e.key === 'Escape' && closeDraftModal()}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="modal" role="document" on:click|stopPropagation on:keydown|stopPropagation>
        <div class="modal-header">
          <h2>{editingDraft ? 'Edit Draft' : 'New Newsletter Draft'}</h2>
          <button class="close-btn" on:click={closeDraftModal}>×</button>
        </div>
        <div class="modal-body">
          <form method="POST" action={editingDraft ? '?/updateDraft' : '?/createDraft'} use:enhance={() => {
          isSubmitting = true;
          return async ({ result, update }) => {
            if (result.type === 'success') {
              // Revalidate ALL data FIRST before updating UI
              await invalidateAll();
              // THEN update the page with fresh data
              await update();
              // NOW close modal and show success toast
              closeDraftModal();
              showToast(editingDraft ? 'Draft updated!' : 'Draft created!', 'success');
            } else if (result.type === 'failure') {
              const data = result.data;
              const errorMessage = data && typeof data === 'object' && 'message' in data ? String(data.message) : 'An error occurred';
              showToast(errorMessage, 'error');
              // Still update the page even on failure
              await update();
            }
            isSubmitting = false;
          };
        }}>
          {#if editingDraft}
            <input type="hidden" name="id" value={editingDraft.id} />
          {/if}
          
          <div class="form-row">
            <label for="draft-subject">Subject</label>
            <input id="draft-subject" type="text" name="subject" bind:value={draftForm.subject} required placeholder="Newsletter subject line..." />
          </div>
          
          <div class="form-row">
            <div class="markdown-label-group">
              <label for="draft-content">Content (Markdown)</label>
              <button 
                type="button" 
                class="markdown-toggle-btn" 
                on:click={() => emailMarkdownHelpExpanded = !emailMarkdownHelpExpanded}
                title="Toggle markdown syntax guide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Email Markdown Guide
              </button>
            </div>
            {#if emailMarkdownHelpExpanded}
              <div class="markdown-guide">
                <p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: #aaa;">✅ Email-safe markdown (all formats work in email clients):</p>
                <div class="markdown-guide-grid">
                  <div class="markdown-guide-item">
                    <strong>Bold</strong>
                    <code>**text**</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Italic</strong>
                    <code>*text*</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Heading 1</strong>
                    <code># Heading</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Heading 2</strong>
                    <code>## Heading</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Heading 3</strong>
                    <code>### Heading</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Link</strong>
                    <code>[text](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>List</strong>
                    <code>- item</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Numbered List</strong>
                    <code>1. item</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Quote</strong>
                    <code>&gt; quote</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Line Break</strong>
                    <code>---</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Strikethrough</strong>
                    <code>~~text~~</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Inline Code</strong>
                    <code>`code`</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Image</strong>
                    <code>![alt](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Image w/ Caption</strong>
                    <code>![alt | caption](url)</code>
                  </div>
                </div>
              </div>
            {/if}
            <textarea id="draft-content" name="content" bind:value={draftForm.content} rows="12" required placeholder="Write your newsletter content here..."></textarea>
          </div>
          
          <div class="form-row">
            <label for="draft-status">Status</label>
            <select id="draft-status" name="status" bind:value={draftForm.status}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          
          {#if draftForm.status === 'scheduled'}
            <div class="form-row">
              <label for="draft-scheduled">Schedule Send Time</label>
              <input id="draft-scheduled" type="datetime-local" name="scheduled_at" bind:value={draftForm.scheduled_at} />
            </div>
          {/if}
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" on:click={closeDraftModal}>Cancel</button>
            <button type="submit" class="btn-primary">{editingDraft ? 'Update' : 'Save Draft'}</button>
          </div>
          </form>
        </div>
      </div>
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
        <div class="modal-body">
          <form method="POST" action={editingBlog ? '?/updateBlog' : '?/createBlog'} use:enhance={() => {
            isSubmitting = true;
            const blogBeingEdited = editingBlog ? { ...editingBlog } : null;
            return async ({ result, update }) => {
              try {
                if (result.type === 'success') {
                  if (blogBeingEdited) {
                    // Optimistically update local blogs list immediately — no waiting on server cache
                    const idx = blogs.findIndex((b) => b.id === blogBeingEdited.id);
                    if (idx !== -1) {
                      blogs[idx] = { ...blogs[idx], ...blogForm, updated_at: new Date().toISOString() };
                      blogs = [...blogs];
                    }
                  } else {
                    // For creates, just trigger a full reload since we need the new DB-assigned id
                    await invalidateAll();
                  }
                  closeBlogModal();
                  showToast(blogBeingEdited ? 'Blog updated successfully!' : 'Blog created successfully!', 'success');
                  // Background sync to ensure local state eventually matches server
                  update({ reset: false });
                } else if (result.type === 'failure') {
                  const failData = result.data;
                  const errorMessage = failData && typeof failData === 'object' && 'message' in failData ? String(failData.message) : 'An error occurred';
                  showToast(errorMessage, 'error');
                  await update({ reset: false });
                } else if (result.type === 'error') {
                  showToast(result.error?.message || 'Server error — please try again', 'error');
                  await update({ reset: false });
                }
              } catch (e) {
                showToast('Unexpected error — please try again', 'error');
              } finally {
                isSubmitting = false;
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
            <div class="markdown-label-group">
              <label for="blog-content">Content (Markdown)</label>
              <button 
                type="button" 
                class="markdown-toggle-btn" 
                on:click={() => markdownHelpExpanded = !markdownHelpExpanded}
                title="Toggle markdown syntax guide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Markdown Guide
              </button>
            </div>
            {#if markdownHelpExpanded}
              <div class="markdown-guide">
                <div class="markdown-guide-grid">
                  <div class="markdown-guide-item">
                    <strong>Bold</strong>
                    <code>**text**</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Italic</strong>
                    <code>*text*</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Heading 1</strong>
                    <code># Heading</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Heading 2</strong>
                    <code>## Heading</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Link</strong>
                    <code>[text](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Image</strong>
                    <code>![alt](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Image Caption</strong>
                    <code>![alt | caption](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Image w/ Height</strong>
                    <code>![alt {'{'} height=300px{'}'}](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Image w/ Both</strong>
                    <code>![alt | caption {'{'} height=300px{'}'}](url)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>List</strong>
                    <code>- item</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Code</strong>
                    <code>`code`</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Code Block</strong>
                    <code>```code block```</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Quote</strong>
                    <code>&gt; quote</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Line Break</strong>
                    <code>---</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Strikethrough</strong>
                    <code>~~text~~</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Video</strong>
                    <code>![alt](video.mp4)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Video Caption</strong>
                    <code>![alt | caption](video.mp4)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Video w/ Height</strong>
                    <code>![alt {'{'} height=400px{'}'}](video.mp4)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Audio</strong>
                    <code>![audio description](audio.mp3)</code>
                  </div>
                  <div class="markdown-guide-item">
                    <strong>Audio Caption</strong>
                    <code>![audio | caption](audio.mp3)</code>
                  </div>
                </div>
              </div>
            {/if}
            <textarea id="blog-content" name="content" bind:value={blogForm.content} rows="10" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-label-group">
              <label for="blog-feature-image">Feature Image URL</label>
              <span class="form-hint">Recommended: 1200x600px</span>
            </div>
            <input id="blog-feature-image" type="url" name="feature_image_url" bind:value={blogForm.feature_image_url} placeholder="https://example.com/image.jpg" />
            {#if blogForm.feature_image_url}
              <div class="image-preview">
                <img src={blogForm.feature_image_url} alt="Feature preview" />
              </div>
            {/if}
          </div>
          
          <div class="form-row-inline">
            <label><input type="checkbox" name="published" bind:checked={blogForm.published} /> Published</label>
            <label><input type="checkbox" name="featured" bind:checked={blogForm.featured} /> Featured</label>
          </div>
          
            <div class="form-actions">
              <button type="button" class="btn-secondary" on:click={closeBlogModal}>Cancel</button>
              <button type="submit" class="btn-primary">{editingBlog ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}

  <!-- Job Modal -->
  {#if showJobModal}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-overlay" role="dialog" aria-modal="true" on:click={closeJobModal} on:keydown={(e) => e.key === 'Escape' && closeJobModal()}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="modal" role="document" on:click|stopPropagation on:keydown|stopPropagation>
        <div class="modal-header">
          <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
          <button class="close-btn" on:click={closeJobModal}>×</button>
        </div>
        <div class="modal-body">
          <form method="POST" action={editingJob ? '?/updateJob' : '?/createJob'} use:enhance={() => {
            isSubmitting = true;
          return async ({ result, update }) => {
            if (result.type === 'success') {
              // Revalidate ALL data FIRST before updating UI
              await invalidateAll();
              // THEN update the page with fresh data
              await update();
              // NOW close modal and show success toast
              closeJobModal();
              showToast(editingJob ? 'Job updated successfully!' : 'Job created successfully!', 'success');
            } else if (result.type === 'failure') {
              // Show error toast but keep modal open
              const data = result.data;
              const errorMessage = data && typeof data === 'object' && 'message' in data ? String(data.message) : 'An error occurred';
              showToast(errorMessage, 'error');
              // Still update the page even on failure
              await update();
            }
            isSubmitting = false;
          };
        }} class="job-form">
          {#if editingJob}
            <input type="hidden" name="id" value={editingJob.id} />
          {/if}

          <!-- Title Section -->
          <div class="form-section">
            <h3>Position</h3>
            <div class="form-group">
              <label for="job-title">Job Title</label>
              <input type="text" id="job-title" name="title" bind:value={jobForm.title} placeholder="e.g., Game Developer" required />
            </div>
          </div>

          <!-- Details Section -->
          <div class="form-section">
            <h3>Job Details</h3>
            <div class="form-grid">
              <div class="form-group">
                <label for="job-department">Department</label>
                <input type="text" id="job-department" name="department" bind:value={jobForm.department} placeholder="e.g., Engineering" required />
              </div>
              <div class="form-group">
                <label for="job-type">Employment Type</label>
                <input type="text" id="job-type" name="job_type" bind:value={jobForm.job_type} placeholder="e.g., Full-time" required />
              </div>
              <div class="form-group">
                <label for="job-location">Location</label>
                <input type="text" id="job-location" name="location" bind:value={jobForm.location} placeholder="e.g., Remote" />
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="form-section">
            <h3>Summary & Description</h3>
            <div class="form-group">
              <label for="job-summary">Job Summary</label>
              <textarea id="job-summary" name="summary" bind:value={jobForm.summary} placeholder="Enter a brief summary of the position (2-3 sentences)..." rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label for="job-description">Job Description</label>
              <textarea id="job-description" name="description" bind:value={jobForm.description} placeholder="Enter comprehensive job description..." rows="10" required></textarea>
            </div>
          </div>

          <!-- Status Section -->
          <div class="form-section">
            <div class="form-checkbox-group">
              <input type="checkbox" id="job-published" name="published" bind:checked={jobForm.published} />
              <label for="job-published">Published</label>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" on:click={closeJobModal}>Cancel</button>
            <button type="submit" class="btn-primary">{editingJob ? 'Update' : 'Create'}</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  {/if}

  <!-- Confirmation Modal -->
  {#if showConfirmModal}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-overlay confirm-modal-overlay" role="dialog" aria-modal="true" on:click={closeConfirmModal} on:keydown={(e) => e.key === 'Escape' && closeConfirmModal()}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="confirm-modal" role="document" on:click|stopPropagation on:keydown|stopPropagation>
        <div class="confirm-modal-icon" class:danger={confirmModalType === 'danger'} class:warning={confirmModalType === 'warning'}>
          {#if confirmModalType === 'danger'}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          {/if}
        </div>
        <h3 class="confirm-modal-title">Confirm Action</h3>
        <p class="confirm-modal-message">{confirmModalMessage}</p>
        <div class="confirm-modal-actions">
          <button type="button" class="btn-secondary" on:click={closeConfirmModal}>Cancel</button>
          <button type="button" class="btn-danger-solid" on:click={executeConfirmAction}>
            {#if confirmModalType === 'danger'}Delete{:else}Confirm{/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
  </div>
</div>

  <!-- Application Response Modal -->
  {#if showApplicationResponseModal && selectedApplication}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-overlay" role="dialog" aria-modal="true" on:click={closeApplicationResponseModal} on:keydown={(e) => e.key === 'Escape' && closeApplicationResponseModal()}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="modal" role="document" on:click|stopPropagation on:keydown|stopPropagation style="max-width: 600px;">
        <div class="modal-header">
          <h2 class="modal-title">
            {#if responseForm.status === 'accepted'}
              ✓ Accept Application
            {:else}
              ✗ Reject Application
            {/if}
          </h2>
          <button type="button" class="modal-close" on:click={closeApplicationResponseModal} aria-label="Close">×</button>
        </div>
        
        <div class="modal-body">
          <div class="app-details-card">
            <h3 class="app-detail-heading">Application Details</h3>
            <div class="app-detail-row">
              <span class="app-detail-label">Name:</span>
              <span class="app-detail-value">{selectedApplication.name}</span>
            </div>
            <div class="app-detail-row">
              <span class="app-detail-label">Position:</span>
              <span class="app-detail-value">{selectedApplication.job_title}</span>
            </div>
            <div class="app-detail-row">
              <span class="app-detail-label">Email:</span>
              <span class="app-detail-value"><a href="mailto:{selectedApplication.email}">{selectedApplication.email}</a></span>
            </div>
          </div>

          <div class="form-group">
            <label for="response-message">Message to Applicant</label>
            <textarea 
              id="response-message" 
              bind:value={responseForm.customMessage}
              rows="6"
              required
            ></textarea>
            <small>This message will be sent directly to the applicant.</small>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" on:click={closeApplicationResponseModal} disabled={isRespondingToApplication}>
            Cancel
          </button>
          <button 
            type="button" 
            class={responseForm.status === 'accepted' ? 'btn-primary' : 'btn-warning'}
            on:click={submitApplicationResponse}
            disabled={isRespondingToApplication}
          >
            {#if isRespondingToApplication}
              Sending...
            {:else if responseForm.status === 'accepted'}
              Send Acceptance
            {:else}
              Send Rejection
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Preset Messages Modal -->
  {#if showPresetMessagesModal}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="modal-overlay" role="dialog" aria-modal="true" on:click={closePresetMessagesModal} on:keydown={(e) => e.key === 'Escape' && closePresetMessagesModal()}>
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="modal" role="document" on:click|stopPropagation on:keydown|stopPropagation style="max-width: 700px;">
        <div class="modal-header">
          <h2 class="modal-title">⚙️ Response Message Templates</h2>
          <button type="button" class="modal-close" on:click={closePresetMessagesModal} aria-label="Close">×</button>
        </div>
        
        <div class="modal-body">
          <div class="preset-template-group">
            <div class="preset-header">
              <h3 class="preset-label">✓ Acceptance Message</h3>
              <p class="preset-description">This message will be used by default when accepting applications.</p>
            </div>
            <textarea 
              id="preset-acceptance" 
              bind:value={presetMessages.acceptance.message}
              rows="5"
              disabled={isSavingTemplates}
            ></textarea>
          </div>

          <div class="preset-template-group">
            <div class="preset-header">
              <h3 class="preset-label">✗ Rejection Message</h3>
              <p class="preset-description">This message will be used by default when rejecting applications.</p>
            </div>
            <textarea 
              id="preset-rejection" 
              bind:value={presetMessages.rejection.message}
              rows="5"
              disabled={isSavingTemplates}
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" on:click={closePresetMessagesModal} disabled={isSavingTemplates}>
            Cancel
          </button>
          <button 
            type="button" 
            class="btn-primary"
            on:click={savePresetMessages}
            disabled={isSavingTemplates}
          >
            {#if isSavingTemplates}
              Saving...
            {:else}
              Save Templates
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

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
  .admin-inner h2,
  .admin-inner h3 {
    font-family: "Raleway", sans-serif;
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
  .section-header { 
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
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
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
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

  /* Jobs List */
  .jobs-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .job-card.admin-view {
    padding: 1.75rem;
    background: linear-gradient(145deg, #12121a 0%, #0d0d14 100%);
    border: 1px solid #1a1a24;
    border-radius: 0.875rem;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .job-card.admin-view:hover {
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 4px 20px rgba(0, 196, 0, 0.1), 0 0 30px rgba(0, 196, 0, 0.05);
    transform: translateY(-2px);
    background: linear-gradient(145deg, #14141f 0%, #0f0f16 100%);
  }

  .job-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .job-header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .job-header h3 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
    color: #f0f0f0;
    font-weight: 600;
  }

  .job-info {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .job-info span {
    font-size: 0.8rem;
    color: #999;
    background: rgba(0, 196, 0, 0.08);
    padding: 0.4rem 0.85rem;
    border-radius: 0.4rem;
    border: 1px solid rgba(0, 196, 0, 0.15);
  }

  .job-card.admin-view .description {
    color: #999;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0.5rem 0 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: pre-line;
  }

  .job-actions {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: 0.5rem;
  }

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
    max-width: 700px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #14141e 0%, #0d0d14 100%);
    border: 1px solid rgba(0, 196, 0, 0.15);
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -10px 50px rgba(0, 0, 0, 0.5);
    overflow: hidden;
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

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .modal-body form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .modal-body .form-actions {
    margin-top: auto;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    margin-bottom: -1.5rem;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(12, 12, 18, 0.5) 0%, #0d0d14 100%);
    flex-shrink: 0;
  }

  .modal-footer {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(12, 12, 18, 0.5) 0%, #0d0d14 100%);
    position: sticky;
    bottom: 0;
  }

  .modal-footer button {
    min-width: 120px;
    transition: all 0.25s ease;
  }

  /* Confirmation Modal */
  .confirm-modal-overlay {
    z-index: 200;
  }

  .confirm-modal {
    background: linear-gradient(180deg, #14141e 0%, #0d0d14 100%);
    border: 1px solid rgba(255, 100, 100, 0.2);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 100, 100, 0.05);
    animation: modalSlideIn 0.2s ease-out;
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .confirm-modal-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  .confirm-modal-icon.danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 2px solid rgba(239, 68, 68, 0.3);
  }

  .confirm-modal-icon.warning {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border: 2px solid rgba(245, 158, 11, 0.3);
  }

  .confirm-modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #e0e0e0;
    margin: 0 0 0.75rem;
  }

  .confirm-modal-message {
    color: #888;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 1.5rem;
  }

  .confirm-modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .confirm-modal-actions button {
    padding: 0.65rem 1.5rem;
    font-size: 0.875rem;
    min-width: 100px;
  }

  .btn-danger-solid {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: 1px solid rgba(239, 68, 68, 0.5);
    color: #fff;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn-danger-solid:hover {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  }

  .modal form { 
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Job Form Specific Styling */
  .job-form h3 {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #00c400;
    margin: 0 0 1rem 0;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }



  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.85rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.625rem;
    color: #f0f0f0;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: #555;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: rgba(0, 196, 0, 0.5);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(0, 196, 0, 0.1), inset 0 0 0 1px rgba(0, 196, 0, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 250px;
    line-height: 1.6;
  }

  /* Preset Template Styles */
  .preset-template-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
    padding: 1.25rem;
    background: rgba(0, 196, 0, 0.03);
    border: 1px solid rgba(0, 196, 0, 0.15);
    border-radius: 0.75rem;
  }

  .preset-template-group:last-child {
    margin-bottom: 0;
  }

  .preset-header {
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(0, 196, 0, 0.1);
  }

  .preset-label {
    font-size: 1rem;
    font-weight: 600;
    color: #00ff00;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.02em;
  }

  .preset-description {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    line-height: 1.5;
  }

  .preset-template-group textarea {
    width: 100%;
    padding: 0.85rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.625rem;
    color: #f0f0f0;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.2s ease;
    resize: vertical;
  }

  .preset-template-group textarea::placeholder {
    color: #555;
  }

  .preset-template-group textarea:focus {
    outline: none;
    border-color: rgba(0, 196, 0, 0.5);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 3px rgba(0, 196, 0, 0.1), inset 0 0 0 1px rgba(0, 196, 0, 0.1);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .form-checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(0, 196, 0, 0.05);
    border: 1px solid rgba(0, 196, 0, 0.15);
    border-radius: 0.625rem;
    font-size: 0.9rem;
  }

  .form-checkbox-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #00c400;
    cursor: pointer;
  }

  .form-checkbox-group label {
    cursor: pointer;
    color: #e0e0e0;
    margin: 0;
  }

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

  .form-label-group {
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
    margin-bottom: 0.4rem;
  }

  .form-label-group label {
    margin-bottom: 0;
  }

  .form-hint {
    font-size: 0.7rem;
    color: #00c400;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
  }

  .markdown-label-group {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.4rem;
  }

  .markdown-label-group label {
    margin-bottom: 0;
  }

  .markdown-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.7rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 0.3rem;
    color: #00c400;
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .markdown-toggle-btn:hover {
    background: rgba(0, 196, 0, 0.2);
    border-color: rgba(0, 196, 0, 0.5);
    box-shadow: 0 2px 8px rgba(0, 196, 0, 0.15);
  }

  .markdown-toggle-btn svg {
    transition: transform 0.2s ease;
  }

  .markdown-guide {
    margin-bottom: 0.75rem;
    padding: 1rem;
    background: rgba(0, 196, 0, 0.05);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 0.5rem;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .markdown-guide-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .markdown-guide-item {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 196, 0, 0.15);
    border-radius: 0.4rem;
    font-size: 0.75rem;
  }

  .markdown-guide-item strong {
    color: #00c400;
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .markdown-guide-item code {
    padding: 0.3rem 0.4rem;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.25rem;
    color: #88ff88;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.65rem;
    word-break: break-word;
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

  .image-preview {
    margin-top: 0.75rem;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid rgba(0, 196, 0, 0.2);
    max-width: 200px;
  }

  .image-preview img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 150px;
    object-fit: cover;
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

  /* Toast Notification */
  .toast {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(145deg, #1a1a24 0%, #12121a 100%);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 0.75rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 196, 0, 0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  }
  .toast.error {
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.1);
  }
  .toast.success {
    border-color: rgba(0, 196, 0, 0.4);
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .toast-icon {
    font-size: 1.25rem;
  }
  .toast-message {
    flex: 1;
    color: #e0e0e0;
    font-size: 0.875rem;
    line-height: 1.4;
  }
  .toast.error .toast-message {
    color: #fca5a5;
  }
  .toast-close {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.375rem;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
    transition: all 0.2s ease;
  }
  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  /* Newsletter Tab Styles */
  .newsletter-section {
    display: grid;
    gap: 1.5rem;
  }

  .newsletter-section.stacked {
    grid-template-columns: 1fr;
  }

  @media (min-width: 1024px) {
    .newsletter-section:not(.stacked) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .newsletter-panel {
    background: linear-gradient(145deg, rgba(18, 18, 26, 0.9) 0%, rgba(13, 13, 20, 0.9) 100%);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .panel-header h2 {
    font-size: 1rem;
    margin: 0;
    color: #e0e0e0;
  }

  .subscriber-count {
    font-size: 0.75rem;
    color: #00c400;
    background: rgba(0, 196, 0, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }

  .subscribers-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .subscriber-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    transition: border-color 0.2s ease;
  }

  .subscriber-card:hover {
    border-color: rgba(0, 196, 0, 0.2);
  }

  .subscriber-info {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .subscriber-email {
    color: #e0e0e0;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .subscriber-name {
    color: #888;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .subscriber-meta {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .source-badge {
    font-size: 0.65rem;
    color: #9333ea;
    background: rgba(147, 51, 234, 0.1);
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
    text-transform: uppercase;
  }

  .sub-date {
    font-size: 0.7rem;
    color: #666;
  }

  /* Drafts List */
  .drafts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .draft-card {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    transition: border-color 0.2s ease;
  }

  .draft-card:hover {
    border-color: rgba(0, 196, 0, 0.2);
  }

  .draft-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .draft-header h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #e0e0e0;
    line-height: 1.3;
  }

  .draft-status .tag {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  .tag.blue {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }

  .draft-preview {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.4;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .draft-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .scheduled-time {
    color: #60a5fa;
  }

  .sent-time {
    color: #00c400;
  }

  .draft-date {
    color: #555;
  }

  .draft-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .btn-send {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
    border: 1px solid rgba(59, 130, 246, 0.4);
    color: #60a5fa;
  }

  .btn-send:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%);
    border-color: rgba(59, 130, 246, 0.6);
    color: #93c5fd;
  }

  .btn-send.sending {
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn-send .spinner,
  .btn-test .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(96, 165, 250, 0.3);
    border-top-color: #60a5fa;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  .btn-send.sending,
  .btn-test.sending {
    opacity: 0.75;
    cursor: not-allowed;
    pointer-events: none;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .btn-test {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
    border: 1px solid rgba(245, 158, 11, 0.4);
    color: #fbbf24;
  }

  .btn-test:hover {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%);
    border-color: rgba(245, 158, 11, 0.6);
    color: #fcd34d;
  }

  .btn-archive {
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%);
    border: 1px solid rgba(147, 51, 234, 0.4);
    color: #a78bfa;
  }

  .btn-archive:hover {
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(147, 51, 234, 0.2) 100%);
    border-color: rgba(147, 51, 234, 0.6);
    color: #c4b5fd;
  }

  .btn-restore {
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.2) 0%, rgba(0, 196, 0, 0.1) 100%);
    border: 1px solid rgba(0, 196, 0, 0.4);
    color: #00c400;
  }

  .btn-restore:hover {
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.3) 0%, rgba(0, 196, 0, 0.2) 100%);
    border-color: rgba(0, 196, 0, 0.6);
    color: #00e000;
  }

  /* Archived Section */
  .archived-panel {
    grid-column: 1 / -1;
    opacity: 0.85;
  }

  .archived-count {
    font-size: 0.75rem;
    color: #888;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }

  .archived-card {
    opacity: 0.8;
    border-left: 3px solid rgba(147, 51, 234, 0.4);
  }

  .archived-card:hover {
    opacity: 1;
  }

  .tag.gray {
    background: rgba(107, 114, 128, 0.15);
    color: #9ca3af;
    border: 1px solid rgba(107, 114, 128, 0.3);
  }

  .recipient-badge {
    font-size: 0.65rem;
    color: #00c400;
    background: rgba(0, 196, 0, 0.1);
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
  }

  /* Collapsible Header */
  .collapsible-header {
    width: 100%;
    background: transparent;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s ease;
  }

  .collapsible-header:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .header-left-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    color: inherit;
  }

  .header-toggle:hover {
    background: transparent;
  }

  .draft-count-badge {
    font-size: 0.7rem;
    color: #888;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.15rem 0.5rem;
    border-radius: 0.75rem;
    margin-left: 0.25rem;
  }

  .btn-sm-header {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }

  .collapse-icon {
    font-size: 0.65rem;
    color: #555;
    transition: color 0.2s ease, transform 0.2s ease;
    opacity: 0.7;
  }

  .collapsible-header:hover .collapse-icon {
    color: #888;
    opacity: 1;
  }

  .collapse-icon.expanded {
    color: #00c400;
    opacity: 1;
  }

  .newsletter-panel.collapsed {
    padding-bottom: 0.75rem;
  }

  .newsletter-panel.collapsed .panel-header {
    border-bottom: none;
    padding-bottom: 0;
  }

  .archived-panel.collapsed {
    padding-bottom: 0.75rem;
  }

  .archived-panel.collapsed .panel-header {
    border-bottom: none;
    padding-bottom: 0;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: 1rem;
  }

  .pagination-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.375rem;
    color: #e0e0e0;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-btn:hover:not(:disabled) {
    background: rgba(0, 196, 0, 0.1);
    border-color: rgba(0, 196, 0, 0.3);
    color: #00c400;
  }

  .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .pagination-info {
    font-size: 0.8rem;
    color: #888;
  }

  /* Form Select */
  select {
    width: 100%;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: #e0e0e0;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  select:focus {
    outline: none;
    border-color: rgba(0, 196, 0, 0.4);
  }

  select option {
    background: #12121a;
    color: #e0e0e0;
  }

  /* Loading Spinner */
  .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(0, 196, 0, 0.2);
    border-top-color: #00c400;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner-text {
    font-size: 1rem;
    color: #00c400;
    font-weight: 500;
    letter-spacing: 0.05em;
    margin: 0;
  }

  /* Button Spinner */
  .btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  button[type="submit"]:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Application Status Badges */
  .status-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.pending {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
  }

  .status-badge.accepted {
    background: rgba(0, 196, 0, 0.2);
    color: #00ff00;
    border: 1px solid rgba(0, 196, 0, 0.3);
  }

  .status-badge.rejected {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255, 107, 107, 0.3);
  }

  .status-badge-small {
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 3px;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .status-badge-small.pending {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
  }

  .status-badge-small.accepted {
    background: rgba(0, 196, 0, 0.2);
    color: #00ff00;
    border: 1px solid rgba(0, 196, 0, 0.3);
  }

  .status-badge-small.rejected {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255, 107, 107, 0.3);
  }

  .app-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Application Details Card in Modal */
  .app-details-card {
    background: rgba(0, 196, 0, 0.05);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .app-detail-heading {
    font-size: 0.95rem;
    font-weight: 600;
    color: #00ff00;
    margin: 0 0 0.75rem 0;
  }

  .app-detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(0, 196, 0, 0.1);
  }

  .app-detail-row:last-child {
    border-bottom: none;
  }

  .app-detail-label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
  }

  .app-detail-value {
    color: #f0f0f0;
    font-size: 0.85rem;
  }

  .app-detail-value a {
    color: #00ff00;
    text-decoration: none;
  }

  .app-detail-value a:hover {
    text-decoration: underline;
  }

  /* Extra small button */
  .btn-xs {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
    height: auto;
    line-height: 1;
  }

  .btn-success {
    background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
    color: #000;
    border: none;
  }

  .btn-success:hover:not(:disabled) {
    background: linear-gradient(135deg, #00ff00 0%, #00bb00 100%);
  }

  .btn-warning {
    padding: 0.6rem 1.25rem;
    background: linear-gradient(135deg, #ff9800 0%, #ff7700 100%);
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.25s ease;
    box-shadow: 0 2px 10px rgba(255, 152, 0, 0.2);
  }

  .btn-warning:hover:not(:disabled) {
    background: linear-gradient(135deg, #ffb366 0%, #ff8811 100%);
    box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
    transform: translateY(-1px);
  }

  .btn-warning:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  small {
    display: block;
    margin-top: 0.4rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
  }
</style>
