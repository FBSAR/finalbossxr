import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AdminDashboardPage from '../../routes/admin/dashboard/+page.svelte';

// Mock $app/forms enhance
vi.mock('$app/forms', () => ({
  enhance: () => () => {}
}));

// Mock data
const mockJobApplication = {
  id: 1,
  job_id: 'eng-001',
  job_title: 'Senior Engineer',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
  linkedin: 'https://linkedin.com/in/johndoe',
  portfolio: 'https://johndoe.dev',
  experience: 'I have 10 years of experience in game development.',
  why_join: 'I want to work on cutting-edge XR technology.',
  resume_filename: 'john_resume.pdf',
  created_at: '2025-01-15T10:30:00Z',
  updated_at: '2025-01-15T10:30:00Z'
};

const mockBlog = {
  id: 1,
  title: 'Building the Future of XR Gaming',
  slug: 'building-the-future-of-xr-gaming',
  excerpt: 'An exciting journey into virtual reality development.',
  content: '# Introduction\n\nThis is our blog content with **markdown**.',
  author: 'FinalBoss XR',
  published: true,
  featured: true,
  created_at: '2025-01-10T09:00:00Z',
  updated_at: '2025-01-10T09:00:00Z'
};

const mockSubscriber = {
  id: 1,
  email: 'subscriber@example.com',
  name: 'Jane Subscriber',
  source: 'website',
  created_at: '2025-01-20T14:00:00Z'
};

const mockNewsletterDraft = {
  id: 1,
  subject: 'January Newsletter',
  content: 'Welcome to our monthly newsletter with exciting updates!',
  status: 'draft',
  scheduled_at: null,
  sent_at: null,
  recipient_count: 0,
  created_by: 'eddie@finalbossxr.com',
  archived: false,
  created_at: '2025-01-21T11:00:00Z',
  updated_at: '2025-01-21T11:00:00Z'
};

const mockArchivedNewsletter = {
  id: 2,
  subject: 'December Newsletter',
  content: 'Happy holidays from FinalBoss XR!',
  status: 'sent',
  scheduled_at: null,
  sent_at: '2024-12-25T10:00:00Z',
  recipient_count: 150,
  created_by: 'eddie@finalbossxr.com',
  archived: true,
  created_at: '2024-12-20T11:00:00Z',
  updated_at: '2024-12-25T10:00:00Z'
};

const mockDashboardData = {
  adminEmail: 'eddie@finalbossxr.com',
  jobApplications: [mockJobApplication],
  blogs: [mockBlog],
  subscribers: [mockSubscriber],
  newsletterDrafts: [mockNewsletterDraft],
  archivedNewsletters: [mockArchivedNewsletter]
};

const emptyDashboardData = {
  adminEmail: 'eddie@finalbossxr.com',
  jobApplications: [],
  blogs: [],
  subscribers: [],
  newsletterDrafts: [],
  archivedNewsletters: []
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the admin dashboard container', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const container = document.querySelector('.admin-container');
      expect(container).toBeTruthy();
    });

    it('renders the inner container', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const inner = document.querySelector('.admin-inner');
      expect(inner).toBeTruthy();
    });

    it('displays Admin Dashboard title', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('⚡ Admin Dashboard')).toBeTruthy();
    });

    it('title has gradient-text class', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const title = document.querySelector('h1.gradient-text');
      expect(title?.textContent).toContain('Admin Dashboard');
    });
  });

  describe('Header Section', () => {
    it('displays admin email', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('eddie@finalbossxr.com')).toBeTruthy();
    });

    it('displays stats in header', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('1 Apps • 1 Blogs • 1 Subscribers')).toBeTruthy();
    });

    it('renders logout button', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('Logout')).toBeTruthy();
    });

    it('logout form has correct action', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const logoutForm = document.querySelector('form[action="?/logout"]');
      expect(logoutForm).toBeTruthy();
    });
  });

  describe('Tabs', () => {
    it('renders Applications tab', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('Applications')).toBeTruthy();
    });

    it('renders Blogs tab', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('Blogs')).toBeTruthy();
    });

    it('renders Newsletter tab', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('Newsletter')).toBeTruthy();
    });

    it('displays Applications tab icon', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('📋')).toBeTruthy();
    });

    it('displays Blogs tab icon', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('📝')).toBeTruthy();
    });

    it('displays Newsletter tab icon', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      expect(screen.getByText('📧')).toBeTruthy();
    });

    it('shows application count in tab', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      // Each tab shows (1), look for tab-count elements
      const tabCounts = document.querySelectorAll('.tab-count');
      expect(tabCounts.length).toBe(3);
    });

    it('Applications tab is active by default', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const tabs = document.querySelectorAll('.tabs button');
      expect(tabs[0].classList.contains('active')).toBeTruthy();
    });

    it('can switch to Blogs tab', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(blogsTab?.classList.contains('active')).toBeTruthy();
    });

    it('can switch to Newsletter tab', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(newsletterTab?.classList.contains('active')).toBeTruthy();
    });
  });

  describe('Applications Tab Content', () => {
    it('shows application name', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      // Name appears in both mobile card and desktop table
      const names = screen.getAllByText('John Doe');
      expect(names.length).toBeGreaterThan(0);
    });

    it('shows job title as badge', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const badges = screen.getAllByText('Senior Engineer');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows application date', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const dateStr = new Date('2025-01-15T10:30:00Z').toLocaleDateString();
      const dates = screen.getAllByText(dateStr);
      expect(dates.length).toBeGreaterThan(0);
    });

    it('shows applicant email link', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const emailLinks = screen.getAllByText('john@example.com');
      expect(emailLinks.length).toBeGreaterThan(0);
    });

    it('shows resume link when available', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const resumeLinks = document.querySelectorAll('a[href="/api/resume/1"]');
      expect(resumeLinks.length).toBeGreaterThan(0);
    });

    it('shows LinkedIn icon when available', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const linkedinLinks = screen.getAllByText('in');
      expect(linkedinLinks.length).toBeGreaterThan(0);
    });

    it('shows delete button for application', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const deleteButtons = screen.getAllByText('🗑');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('shows expand button', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      // Mobile card has "▼ More" button
      expect(screen.getByText('▼ More')).toBeTruthy();
    });

    it('shows empty state when no applications', () => {
      render(AdminDashboardPage, { props: { data: emptyDashboardData, form: null } });
      expect(screen.getByText('No job applications yet')).toBeTruthy();
    });

    it('can expand application details', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const expandBtn = screen.getByText('▼ More');
      await fireEvent.click(expandBtn);
      expect(screen.getByText('▲ Less')).toBeTruthy();
    });
  });

  describe('Blogs Tab Content', () => {
    it('shows New Blog button when on blogs tab', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('+ New Blog')).toBeTruthy();
    });

    it('shows blog title', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('Building the Future of XR Gaming')).toBeTruthy();
    });

    it('shows Published tag for published blog', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('Published')).toBeTruthy();
    });

    it('shows Featured tag for featured blog', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('Featured')).toBeTruthy();
    });

    it('shows blog excerpt', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('An exciting journey into virtual reality development.')).toBeTruthy();
    });

    it('shows Edit button for blog', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('Edit')).toBeTruthy();
    });

    it('shows empty state when no blogs', async () => {
      render(AdminDashboardPage, { props: { data: emptyDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('No blogs yet. Create your first post!')).toBeTruthy();
    });

    it('shows Draft tag for unpublished blog', async () => {
      const dataWithDraft = {
        ...mockDashboardData,
        blogs: [{ ...mockBlog, published: false }]
      };
      render(AdminDashboardPage, { props: { data: dataWithDraft, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      expect(screen.getByText('Draft')).toBeTruthy();
    });
  });

  describe('Newsletter Tab Content', () => {
    it('shows Email Subscribers section', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('📧 Email Subscribers')).toBeTruthy();
    });

    it('shows subscriber count', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('1 subscribers')).toBeTruthy();
    });

    it('shows subscriber email', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('subscriber@example.com')).toBeTruthy();
    });

    it('shows subscriber name', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('Jane Subscriber')).toBeTruthy();
    });

    it('shows subscriber source badge', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('website')).toBeTruthy();
    });

    it('shows Newsletter Drafts section', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('📝 Newsletter Drafts')).toBeTruthy();
    });

    it('shows New Draft button', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('+ New Draft')).toBeTruthy();
    });

    it('shows draft subject', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('January Newsletter')).toBeTruthy();
    });

    it('shows draft status tag', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      // Has "Draft" tag for the draft status
      const draftTags = screen.getAllByText('Draft');
      expect(draftTags.length).toBeGreaterThan(0);
    });

    it('shows Send button for draft', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('📤 Send')).toBeTruthy();
    });

    it('shows Archived Newsletters section', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('📦 Archived Newsletters')).toBeTruthy();
    });

    it('shows archived count', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('1 archived')).toBeTruthy();
    });

    it('shows empty state for no subscribers', async () => {
      render(AdminDashboardPage, { props: { data: emptyDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('No subscribers yet')).toBeTruthy();
    });

    it('shows empty state for no drafts', async () => {
      render(AdminDashboardPage, { props: { data: emptyDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('No drafts yet. Create your first newsletter!')).toBeTruthy();
    });
  });

  describe('Blog Modal', () => {
    it('opens blog modal when clicking New Blog', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByText('New Blog')).toBeTruthy();
    });

    it('modal has title input', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByLabelText('Title')).toBeTruthy();
    });

    it('modal has slug input', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByLabelText('Slug')).toBeTruthy();
    });

    it('modal has excerpt textarea', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByLabelText('Excerpt')).toBeTruthy();
    });

    it('modal has content textarea', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByLabelText('Content (Markdown)')).toBeTruthy();
    });

    it('modal has author input', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByLabelText('Author')).toBeTruthy();
    });

    it('modal has Published checkbox', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      // Published checkbox in form modal
      const publishedInput = document.querySelector('input[name="published"]');
      expect(publishedInput).toBeTruthy();
    });

    it('modal has Featured checkbox', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      // Featured is in multiple places, need to find the checkbox label
      const featuredLabel = document.querySelector('label input[name="featured"]');
      expect(featuredLabel).toBeTruthy();
    });

    it('modal has Cancel button', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByText('Cancel')).toBeTruthy();
    });

    it('modal has Create button for new blog', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      expect(screen.getByText('Create')).toBeTruthy();
    });

    it('modal has close button', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      const closeBtn = document.querySelector('.close-btn');
      expect(closeBtn).toBeTruthy();
    });

    it('closes modal when clicking Cancel', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      const cancelBtn = screen.getByText('Cancel');
      await fireEvent.click(cancelBtn);
      const modal = document.querySelector('.modal-overlay');
      expect(modal).toBeFalsy();
    });

    it('opens Edit Blog modal when clicking Edit', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const editBtn = screen.getByText('Edit');
      await fireEvent.click(editBtn);
      expect(screen.getByText('Edit Blog')).toBeTruthy();
    });
  });

  describe('Newsletter Draft Modal', () => {
    it('opens draft modal when clicking New Draft', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const newDraftBtn = screen.getByText('+ New Draft');
      await fireEvent.click(newDraftBtn);
      expect(screen.getByText('New Newsletter Draft')).toBeTruthy();
    });

    it('draft modal has subject input', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const newDraftBtn = screen.getByText('+ New Draft');
      await fireEvent.click(newDraftBtn);
      expect(screen.getByLabelText('Subject')).toBeTruthy();
    });

    it('draft modal has content textarea', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const newDraftBtn = screen.getByText('+ New Draft');
      await fireEvent.click(newDraftBtn);
      expect(screen.getByLabelText('Content')).toBeTruthy();
    });

    it('draft modal has status select', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const newDraftBtn = screen.getByText('+ New Draft');
      await fireEvent.click(newDraftBtn);
      expect(screen.getByLabelText('Status')).toBeTruthy();
    });

    it('draft modal has Save Draft button', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const newDraftBtn = screen.getByText('+ New Draft');
      await fireEvent.click(newDraftBtn);
      expect(screen.getByText('Save Draft')).toBeTruthy();
    });

    it('opens Edit Draft modal when clicking Edit on draft', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      // There are multiple Edit buttons, find the one in drafts section
      const editButtons = screen.getAllByText('Edit');
      await fireEvent.click(editButtons[0]);
      expect(screen.getByText('Edit Draft')).toBeTruthy();
    });
  });

  describe('Confirmation Modal', () => {
    it('shows confirmation when deleting', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      // Find delete button in application card
      const deleteButtons = screen.getAllByText('🗑 Delete');
      await fireEvent.click(deleteButtons[0]);
      expect(screen.getByText('Confirm Action')).toBeTruthy();
    });

    it('confirmation modal has Cancel button', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const deleteButtons = screen.getAllByText('🗑 Delete');
      await fireEvent.click(deleteButtons[0]);
      const cancelButtons = screen.getAllByText('Cancel');
      expect(cancelButtons.length).toBeGreaterThan(0);
    });

    it('confirmation modal has Delete button', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const deleteButtons = screen.getAllByText('🗑 Delete');
      await fireEvent.click(deleteButtons[0]);
      expect(screen.getByText('Delete')).toBeTruthy();
    });

    it('closes confirmation on Cancel', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const deleteButtons = screen.getAllByText('🗑 Delete');
      await fireEvent.click(deleteButtons[0]);
      const cancelBtns = screen.getAllByText('Cancel');
      // Click the last Cancel which should be in the confirmation modal
      await fireEvent.click(cancelBtns[cancelBtns.length - 1]);
      // Modal should be closed
      const confirmModal = document.querySelector('.confirm-modal');
      expect(confirmModal).toBeFalsy();
    });
  });

  describe('Newsletter Status Tags', () => {
    it('shows Scheduled tag for scheduled newsletter', async () => {
      const dataWithScheduled = {
        ...mockDashboardData,
        newsletterDrafts: [{
          ...mockNewsletterDraft,
          status: 'scheduled',
          scheduled_at: '2025-02-01T10:00:00Z'
        }]
      };
      render(AdminDashboardPage, { props: { data: dataWithScheduled, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('Scheduled')).toBeTruthy();
    });

    it('shows Sent tag for sent newsletter', async () => {
      const dataWithSent = {
        ...mockDashboardData,
        newsletterDrafts: [{
          ...mockNewsletterDraft,
          status: 'sent',
          sent_at: '2025-01-21T12:00:00Z'
        }]
      };
      render(AdminDashboardPage, { props: { data: dataWithSent, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('Sent')).toBeTruthy();
    });

    it('shows Archive button for sent newsletter', async () => {
      const dataWithSent = {
        ...mockDashboardData,
        newsletterDrafts: [{
          ...mockNewsletterDraft,
          status: 'sent',
          sent_at: '2025-01-21T12:00:00Z'
        }]
      };
      render(AdminDashboardPage, { props: { data: dataWithSent, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      expect(screen.getByText('📥 Archive')).toBeTruthy();
    });
  });

  describe('Archived Newsletters', () => {
    it('can expand archived section', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      // Click on archived section header to expand
      const archivedHeader = screen.getByText('📦 Archived Newsletters').closest('button');
      await fireEvent.click(archivedHeader!);
      expect(screen.getByText('December Newsletter')).toBeTruthy();
    });

    it('shows Restore button for archived newsletter', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const archivedHeader = screen.getByText('📦 Archived Newsletters').closest('button');
      await fireEvent.click(archivedHeader!);
      expect(screen.getByText('↩ Restore')).toBeTruthy();
    });

    it('shows recipient count for archived newsletter', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const archivedHeader = screen.getByText('📦 Archived Newsletters').closest('button');
      await fireEvent.click(archivedHeader!);
      expect(screen.getByText('👥 150')).toBeTruthy();
    });

    it('shows Archived tag', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const archivedHeader = screen.getByText('📦 Archived Newsletters').closest('button');
      await fireEvent.click(archivedHeader!);
      expect(screen.getByText('Archived')).toBeTruthy();
    });
  });

  describe('Collapsible Sections', () => {
    it('subscribers section is expanded by default', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      // Should see subscriber email
      expect(screen.getByText('subscriber@example.com')).toBeTruthy();
    });

    it('drafts section is expanded by default', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      // Should see draft subject
      expect(screen.getByText('January Newsletter')).toBeTruthy();
    });

    it('archived section is collapsed by default', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      // Should NOT see archived newsletter subject until expanded
      const archivedSubject = screen.queryByText('December Newsletter');
      expect(archivedSubject).toBeFalsy();
    });

    it('can collapse subscribers section', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const subscribersHeader = screen.getByText('📧 Email Subscribers').closest('button');
      await fireEvent.click(subscribersHeader!);
      // Email should be hidden now
      expect(screen.queryByText('subscriber@example.com')).toBeFalsy();
    });
  });

  describe('Form Actions', () => {
    it('delete application form has correct action', () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const deleteForm = document.querySelector('form[action="?/deleteApplication"]');
      expect(deleteForm).toBeTruthy();
    });

    it('delete blog form has correct action', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const deleteForm = document.querySelector('form[action="?/deleteBlog"]');
      expect(deleteForm).toBeTruthy();
    });

    it('create blog form has correct action', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      const form = document.querySelector('form[action="?/createBlog"]');
      expect(form).toBeTruthy();
    });

    it('update blog form has correct action when editing', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const editBtn = screen.getByText('Edit');
      await fireEvent.click(editBtn);
      const form = document.querySelector('form[action="?/updateBlog"]');
      expect(form).toBeTruthy();
    });

    it('send newsletter form has correct action', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const newsletterTab = screen.getByText('Newsletter').closest('button');
      await fireEvent.click(newsletterTab!);
      const sendForm = document.querySelector('form[action="?/sendNewsletter"]');
      expect(sendForm).toBeTruthy();
    });
  });

  describe('Application Details', () => {
    it('shows experience when expanded', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const expandBtn = screen.getByText('▼ More');
      await fireEvent.click(expandBtn);
      const expTexts = screen.getAllByText('I have 10 years of experience in game development.');
      expect(expTexts.length).toBeGreaterThan(0);
    });

    it('shows why join when expanded', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const expandBtn = screen.getByText('▼ More');
      await fireEvent.click(expandBtn);
      const whyJoinTexts = screen.getAllByText('I want to work on cutting-edge XR technology.');
      expect(whyJoinTexts.length).toBeGreaterThan(0);
    });

    it('shows phone when expanded', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const expandBtn = screen.getByText('▼ More');
      await fireEvent.click(expandBtn);
      const phoneTexts = screen.getAllByText('555-1234');
      expect(phoneTexts.length).toBeGreaterThan(0);
    });

    it('shows portfolio link when expanded', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const expandBtn = screen.getByText('▼ More');
      await fireEvent.click(expandBtn);
      const portfolioLinks = screen.getAllByText('https://johndoe.dev');
      expect(portfolioLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Error Toast', () => {
    it('shows error toast when form has error', () => {
      render(AdminDashboardPage, { 
        props: { 
          data: mockDashboardData, 
          form: { error: true, message: 'Something went wrong' } 
        } 
      });
      // Toast should appear with error message
      const toast = document.querySelector('.toast.error');
      expect(toast).toBeTruthy();
    });
  });

  describe('Multiple Applications', () => {
    it('renders multiple applications', () => {
      const multiAppData = {
        ...mockDashboardData,
        jobApplications: [
          mockJobApplication,
          { ...mockJobApplication, id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
      };
      render(AdminDashboardPage, { props: { data: multiAppData, form: null } });
      // Names appear in both mobile cards and desktop table
      const johnDoes = screen.getAllByText('John Doe');
      const janes = screen.getAllByText('Jane Smith');
      expect(johnDoes.length).toBeGreaterThan(0);
      expect(janes.length).toBeGreaterThan(0);
    });

    it('updates stats for multiple items', () => {
      const multiData = {
        ...mockDashboardData,
        jobApplications: [mockJobApplication, { ...mockJobApplication, id: 2 }],
        blogs: [mockBlog, { ...mockBlog, id: 2, title: 'Second Blog' }],
        subscribers: [mockSubscriber, { ...mockSubscriber, id: 2, email: 'sub2@example.com' }]
      };
      render(AdminDashboardPage, { props: { data: multiData, form: null } });
      expect(screen.getByText('2 Apps • 2 Blogs • 2 Subscribers')).toBeTruthy();
    });
  });

  describe('Modal Accessibility', () => {
    it('blog modal has dialog role', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toBeTruthy();
    });

    it('blog modal has aria-modal attribute', async () => {
      render(AdminDashboardPage, { props: { data: mockDashboardData, form: null } });
      const blogsTab = screen.getByText('Blogs').closest('button');
      await fireEvent.click(blogsTab!);
      const newBlogBtn = screen.getByText('+ New Blog');
      await fireEvent.click(newBlogBtn);
      const modal = document.querySelector('[aria-modal="true"]');
      expect(modal).toBeTruthy();
    });
  });
});
