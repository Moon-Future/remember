import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export interface PhotoAsset {
  uri: string;
  width?: number;
  height?: number;
  type?: 'image' | 'video';
  fileName?: string;
  fileSize?: number;
}

export function useCamera() {
  const takePhoto = useCallback(async (options?: {
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<PhotoAsset> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('相机权限被拒绝，请在设置中开启相机权限');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: options?.allowsEditing ?? true,
      aspect: options?.aspect ?? [4, 3],
      quality: options?.quality ?? 0.8,
    });

    if (result.canceled) {
      throw new Error('取消拍照');
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
    };
  }, []);

  const pickImage = useCallback(async (options?: {
    allowsMultipleSelection?: boolean;
    selectionLimit?: number;
    quality?: number;
  }): Promise<PhotoAsset | PhotoAsset[]> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('相册权限被拒绝，请在设置中开启相册权限');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
      selectionLimit: options?.selectionLimit ?? 9,
      quality: options?.quality ?? 0.8,
    });

    if (result.canceled) {
      throw new Error('取消选择');
    }

    const assets = result.assets.map((asset) => ({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
    }));

    return options?.allowsMultipleSelection ? assets : assets[0];
  }, []);

  return {
    takePhoto,
    pickImage,
  };
}
