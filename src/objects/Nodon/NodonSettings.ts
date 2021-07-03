import { Nodon } from './NodonBase';

export type NodonSettingMap<T extends Nodon> = Record<keyof T, NodonSettingDescriptor>;

export const enum NodonSettingType {
  Number,
  Range,
  Enum,
  String,
  Size,
  Position,
  Rotation,
};

export interface NodonSettingDescriptorBase {
  type: NodonSettingType,
  label: string,
};

export interface NodonSettingNumberDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.Number,
  min: number,
  max: number,
};

export interface NodonSettingRangeDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.Range,
  min: number,
  max: number,
};

export interface NodonSettingEnumDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.Enum,
  enum: { [name: string]: string | number }
};

export interface NodonSettingStringDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.String,
  maxLength: number
};

export interface NodonSettingSizeDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.Size,
};

export interface NodonSettingPositionDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.Position,
};

export interface NodonSettingRotationDescriptor extends NodonSettingDescriptorBase {
  type: NodonSettingType.Rotation,
};

export type NodonSettingDescriptor = 
  | NodonSettingNumberDescriptor
  | NodonSettingRangeDescriptor
  | NodonSettingEnumDescriptor
  | NodonSettingStringDescriptor
  | NodonSettingSizeDescriptor
  | NodonSettingPositionDescriptor
  | NodonSettingRotationDescriptor
;

export function nodonSetting(options: NodonSettingDescriptor) {
  return function<T extends Nodon>(target: T, propKey: keyof Omit<T, keyof Nodon>, descriptor: PropertyDescriptor) {
    target.settings = target.settings || ({} as NodonSettingMap<T>);
    target.settings[propKey] = options;
  }
}