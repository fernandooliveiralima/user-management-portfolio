import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';

import { UserPosts } from '@/shared/services/user-posts/user-posts';
import type { Posts } from '@/shared/types/posts/posts.model';

export interface PostState {
  posts: Posts[];
  loading: boolean;
  loaded: boolean;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  loaded: false
};

export const PostStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store, postService = inject(UserPosts)) => ({
    async loadPosts() {
      
      if (store.loaded()) return;

      patchState(store, { loading: true });
      try {
        const data = await lastValueFrom(postService.getPosts());

        patchState(store, {
          posts: [...store.posts(), ...data],
          loading: false,
          loaded: true, 
        });
      } catch (error) {
        console.error(error);
        patchState(store, { loading: false });
      }
    },
    
    addPost(newPost: Posts) {
      patchState(store, {
        posts: [newPost, ...store.posts()],
      });
    },

    removePost(id: number) { 
      patchState(store, {
        posts: store.posts().filter(post => post.id !== id)
      })
    },

    updatePostInStore(updatedPost: Posts) {
      patchState(store, {
        posts: store.posts().map(post => 
          post.id === updatedPost.id ? updatedPost : post
        )
      });
    }
  })),
);
