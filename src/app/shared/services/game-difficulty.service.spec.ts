import { TestBed } from '@angular/core/testing';

import { GameDifficultyService } from './game-difficulty.service';

describe('GameDifficultyService', () => {
  let service: GameDifficultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDifficultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
