import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, required, minLength, FormRoot, FormField } from '@angular/forms/signals';
import { lastValueFrom } from 'rxjs';

import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import type { Posts } from '@/shared/types/posts/posts.model';

@Component({
  selector: 'app-edit-post-modal',
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './edit-post-modal.html',
  styleUrl: './edit-post-modal.scss',
})
export class EditPostModal {
  private postService = inject(UserPosts);
  private postStore = inject(PostStore);

  // inputs & outputs
  post = input.required<Posts>();
  closeModal = output<void>();

  // Estado interno para controlar o formulário e o botão de salvar
  formModel = signal<Posts>({ title: '', body: '' });
  isSaving = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.formModel.set({ ...this.post() });
    });
  }

  editForm = form(
    this.formModel,
    (schema) => {
      required(schema.title);
      required(schema.body);
      minLength(schema.title, 5);
    },
    {
      submission: {
        action: async (f) => {
          const originalPost = this.post();
          if (!originalPost.id) return;

          this.isSaving.set(true);
          try {
            const updatedData = { ...f().value(), id: originalPost.id };

            if (originalPost.id > 100) {
              console.log(
                'Post local detectado (>100). Ignorando API externa para evitar Erro 500.',
              );
              this.postStore.updatePostInStore(updatedData);
            } else {
              const response = await lastValueFrom(
                this.postService.updatePost(originalPost.id, updatedData),
              );
              this.postStore.updatePostInStore(response);
            }

            this.closeModal.emit();
          } catch (error) {
            console.error('Erro ao salvar edição no componente modal:', error);
          } finally {
            this.isSaving.set(false);
          }
        },
      },
    },
  );
}
