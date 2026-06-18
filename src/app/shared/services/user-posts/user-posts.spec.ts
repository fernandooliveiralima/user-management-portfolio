import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { UserPosts } from './user-posts';
import { environment } from 'src/environments/environment';
import type { Posts } from '@/shared/types/posts/posts.model';

describe('UserPosts', () => {
  let service: UserPosts;
  let httpMock: HttpTestingController;
  const mockUrl = `${environment.apiUrl}/posts`;

  const mockPosts: Posts[] = [
    { userId: 1, id: 1, title: 'Post 1', content: 'Conteúdo 1' } as unknown as Posts,
    { userId: 1, id: 2, title: 'Post 2', content: 'Conteúdo 2' } as unknown as Posts,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPosts, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserPosts);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts via GET', () => {
    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
      expect(posts.length).toBe(2);
    });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should create a new post via POST', () => {
    const newPost = { title: 'Novo Post', body: 'Novo Conteúdo' } as Posts;
    service.createPost(newPost).subscribe((post) => {
      expect(post).toEqual({ id: 3, ...newPost });
    });

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush({ id: 3, ...newPost });
  });

  it('should update an existing post via PUT', () => {
    const updatedPost = { id: 1, title: 'Post Atualizado' } as Posts;
    service.updatePost(1, updatedPost).subscribe((post) => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne(`${mockUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPost);
    req.flush(updatedPost);
  });

  it('should delete a post via DELETE', () => {
    service.deletePost(1).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${mockUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush([]);
  });
});
