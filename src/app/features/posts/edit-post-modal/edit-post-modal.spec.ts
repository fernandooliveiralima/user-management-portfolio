import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { vi } from 'vitest';

import { EditPostModal } from './edit-post-modal';
import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import { of } from 'rxjs';

describe('EditPostModal', () => {
  let component: EditPostModal;
  let fixture: ComponentFixture<EditPostModal>;
  let componentRef: ComponentRef<EditPostModal>;

  const mockUserPosts = {
    updatePost: vi.fn().mockReturnValue(of({ id: 1, title: 'Atualizado', body: 'Conteúdo' })),
  };

  const mockPostStore = {
    updatePostInStore: vi.fn(),
  };

  const mockPostData = { id: 1, title: 'Título Teste', body: 'Conteúdo Teste' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostModal],
      providers: [
        { provide: UserPosts, useValue: mockUserPosts },
        { provide: PostStore, useValue: mockPostStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostModal);
    component = fixture.componentInstance;

    componentRef = fixture.componentRef;

    componentRef.setInput('post', mockPostData);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
