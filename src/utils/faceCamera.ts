export function faceCameraRotationDeg(thetaDeg: number, sceneDeg = 0): number {
  return -(thetaDeg + sceneDeg);
}