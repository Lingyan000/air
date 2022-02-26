import { CLOUD_SHEAR_PLATE_MAP, PASSWORD_SIGN } from '#/config';

export function getPasswordRuleType(password: string): PasswordSignType {
  for (const type in PASSWORD_SIGN) {
    const reg = new RegExp(`海阔视界.*${PASSWORD_SIGN[type].sign}.+`, 'g');
    if (reg.test(password)) {
      return type as PasswordSignType;
    }
  }
  throw new Error('口令无法识别，请确认规则是否正确！');
}

export function isCloudShearPlate(password: string): boolean {
  for (const type in CLOUD_SHEAR_PLATE_MAP) {
    const reg = new RegExp(CLOUD_SHEAR_PLATE_MAP[type].validator, 'g');
    if (reg.test(password.split('\n')[0])) {
      return true;
    }
  }
  return false;
}
