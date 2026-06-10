import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, required, minLength, FormRoot, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import type { Posts } from '@/shared/types/posts/posts.model';
import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  postService = inject(UserPosts);
  postStore = inject(PostStore);
  routerInstance = inject(Router);
  
  formModel = signal<Posts>({ title: '', body: '' });

  postForm = form(
    this.formModel,
    (schema) => {
      (required(schema.title), required(schema.body));
      minLength(schema.title, 5);
    },
    {
      submission: {
        action: async (f) => {
          try {
            const createdPost = await lastValueFrom(this.postService.createPost(f().value()));
            this.postStore.addPost(createdPost);
            console.log('Post adicionado à Store Global com sucesso:', createdPost);
            this.routerInstance.navigate([""])
          } catch(error) {
            console.error('Erro ao salvar o post através do fluxo:', error);
          }
        },
      },
    },
  );
}
