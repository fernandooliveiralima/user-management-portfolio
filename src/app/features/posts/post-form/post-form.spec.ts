import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, beforeEach, it, expect, type MockInstance, type Mock } from 'vitest';

import { PostForm } from './post-form';
import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import type { Posts } from '@/shared/types/posts/posts.model';

describe('PostForm', () => {
  let component: PostForm;
  let fixture: ComponentFixture<PostForm>;

  let userPostsMock: {
    createPost: MockInstance<typeof UserPosts.prototype.createPost>;
  };
  let postStoreMock: {
    addPost: Mock;
  };
  let routerMock: {
    navigate: Mock;
  };

  const mockCreatedPost = { id: 10, title: 'Test Title', body: 'Test Body Content' } as Posts;

  beforeEach(async () => {
    userPostsMock = { createPost: vi.fn() };
    postStoreMock = { addPost: vi.fn() };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PostForm],
      providers: [
        { provide: UserPosts, useValue: userPostsMock },
        { provide: PostStore, useValue: postStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should successfully submit form, add to store, and navigate to home', async () => {
    userPostsMock.createPost.mockReturnValue(of(mockCreatedPost));
    component.formModel.set({ title: 'Test Title', body: 'Test Body Content' });
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(userPostsMock.createPost).toHaveBeenCalledWith({
      title: 'Test Title',
      body: 'Test Body Content',
    });

    expect(postStoreMock.addPost).toHaveBeenCalledWith(mockCreatedPost);
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });

  it('should catch error and log to console if API fails during submission', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    userPostsMock.createPost.mockReturnValue(throwError(() => new Error('Erro de Api')));

    component.formModel.set({ title: 'Test Title', body: 'Test Body Content' });
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(postStoreMock.addPost).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
