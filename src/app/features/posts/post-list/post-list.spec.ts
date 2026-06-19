import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi, describe, beforeEach, it, expect, type MockInstance, type Mock } from 'vitest';

import { PostList } from './post-list';
import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import type { Posts } from '@/shared/types/posts/posts.model';

describe('PostList', () => {
  let component: PostList;
  let fixture: ComponentFixture<PostList>;

  let userPostsMock: {
    deletePost: MockInstance<typeof UserPosts.prototype.deletePost>;
  };
  let postStoreMock: {
    loadPosts: Mock;
    removePost: Mock;
    posts: Mock;
    loading: Mock;
  };

  const mockPost: Posts = { id: 1, title: 'Post Angular 21', body: 'Portfolio Angular' };

  beforeEach(async () => {
    userPostsMock = {
      deletePost: vi.fn(),
    };
    postStoreMock = {
      loadPosts: vi.fn(),
      removePost: vi.fn(),
      posts: vi.fn(() => [mockPost]),
      loading: vi.fn(() => false),
    };

    await TestBed.configureTestingModule({
      imports: [PostList],
      providers: [
        { provide: UserPosts, useValue: userPostsMock },
        { provide: PostStore, useValue: postStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostList);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load posts from store on initialization', () => {
    fixture.detectChanges();
    expect(postStoreMock.loadPosts).toHaveBeenCalled();
  });

  it('should set selectedPostForEdit when opening edit modal', () => {
    component.onEditModal(mockPost);
    expect(component.selectedPostForEdit()).toEqual(mockPost);
  });

  it('should clear selectedPostForEdit when closing modal', () => {
    component.onEditModal(mockPost);
    component.onCloseModal();
    expect(component.selectedPostForEdit()).toBeNull();
  });

  it('should not remove post if user cancels confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await component.onRemovePost(1);
    expect(userPostsMock.deletePost).not.toHaveBeenCalled();
    expect(postStoreMock.removePost).not.toHaveBeenCalled();
  });

  it('should successfully delete post through service and store when confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    userPostsMock.deletePost.mockReturnValue(of(void 0) as any );
    await component.onRemovePost(1);

    expect(userPostsMock.deletePost).toHaveBeenCalledWith(1);
    expect(postStoreMock.removePost).toHaveBeenCalledWith(1);
  });

  it('should handle error gracefully when delete service fails', async () => { 
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    userPostsMock.deletePost.mockReturnValue(throwError(() => new Error('Api Error')));
    await component.onRemovePost(1);

    expect(userPostsMock.deletePost).toHaveBeenCalledWith(1);
    expect(postStoreMock.removePost).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  });
  
});
