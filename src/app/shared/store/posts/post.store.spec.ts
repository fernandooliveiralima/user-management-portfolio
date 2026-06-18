import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { type MockInstance } from 'vitest';

import { PostStore } from './post.store';
import { UserPosts } from '@/shared/services/user-posts/user-posts';
import type { Posts } from '@/shared/types/posts/posts.model';

describe('PostStore', () => {
  let store: InstanceType<typeof PostStore>;
  
  let userPostsMock: {
    getPosts: MockInstance<typeof UserPosts.prototype.getPosts>;
  };

  const mockPosts: Posts[] = [
    { id: 1, title: 'Post 1' } as unknown as Posts,
    { id: 2, title: 'Post 2' } as unknown as Posts,
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    userPostsMock = {
      getPosts: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [PostStore, { provide: UserPosts, useValue: userPostsMock }],
    });

    store = TestBed.inject(PostStore);
    userPostsMock = TestBed.inject(UserPosts) as any;
  });

  it('should have initial state', () => {
    expect(store.posts()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(false);
  });

  it('should load posts successfully from service', async () => {
    userPostsMock.getPosts.mockReturnValue(of(mockPosts));

    await store.loadPosts();

    expect(userPostsMock.getPosts).toHaveBeenCalledTimes(1);
    expect(store.posts()).toEqual(mockPosts);
    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(true);
  });

  it('should not fetch posts if already loaded', async () => {
    userPostsMock.getPosts.mockReturnValue(of(mockPosts));
    await store.loadPosts();
    expect(userPostsMock.getPosts).toHaveBeenCalledTimes(1);
  });

  it('should handle error when loading posts fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    userPostsMock.getPosts.mockReturnValue(throwError(() => new Error('Api Error')));
    await store.loadPosts();

    expect(store.loading()).toBe(false);
    expect(store.loaded()).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should add a new post to the beginning of the list', () => {
    const newPost = { id: 3, title: 'New Post' } as Posts;
    store.addPost(newPost);

    expect(store.posts()).toContain(newPost);
    expect(store.posts()[0]).toEqual(newPost);
  });

  it('should update a post in the store', () => {
    const originalPost = { id: 1, title: 'Original Title' } as Posts;
    const updatedPost = { id: 1, title: 'Updated Title' } as Posts;

    store.addPost(originalPost);
    store.updatePostInStore(updatedPost);

    const postInStore = store.posts().find((p) => p.id === 1);
    expect(postInStore?.title).toBe('Updated Title');
  });

  it('should remove a post by id', () => {
    userPostsMock.getPosts.mockReturnValue(of(mockPosts));

    store.addPost(mockPosts[0]);
    store.addPost(mockPosts[1]);

    store.removePost(1);

    expect(store.posts().find((p) => p.id === 1)).toBeUndefined();
    expect(store.posts().length).toBe(1);
  });
});
