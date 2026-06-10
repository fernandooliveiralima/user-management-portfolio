import { TestBed } from '@angular/core/testing';

import { UserPosts } from './user-posts';

describe('UserPosts', () => {
  let service: UserPosts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPosts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
