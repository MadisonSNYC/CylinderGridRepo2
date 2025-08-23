import { describe, it, expect } from 'vitest';
import { faceCameraRotationDeg } from '@/utils/faceCamera';

describe('faceCameraRotationDeg', () => {
  it('cancels only local theta when no scene rotation', () => {
    expect(faceCameraRotationDeg(0)).toBe(-0);
    expect(faceCameraRotationDeg(45)).toBe(-45);
    expect(faceCameraRotationDeg(-90)).toBe(90);
  });
  it('cancels both theta and scene rotation', () => {
    expect(faceCameraRotationDeg(30, 30)).toBe(-60);
    expect(faceCameraRotationDeg(60, -15)).toBe(-45);
  });
});