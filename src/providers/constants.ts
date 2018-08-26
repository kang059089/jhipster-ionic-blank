/**
 * 一些常量设置
 */
/*----------------------------------------文件服务器地址----------------------------------------*/
export const FILE_SERVE_URL = 'http://192.168.0.147:8080/jhipsterIonicBlank';//文件服务:测试环境

/*----------------------app版本升级服务地址,查询app最新版本号,更新日志.---------------------------*/
// export const APP_VERSION_SERVE_URL = 'http://172.16.19.86:8111/api/';//原测试环境
export const APP_VERSION_SERVE_URL = 'http://192.168.0.147:8080/version/jhipsterIonicBlank/android/jhipsterIonicBlank.apk';//新测试环境

export const DEFAULT_AVATAR = 'assets/imgs/avatar.png';//用户默认头像
export const IMAGE_SIZE = 1024;//拍照/从相册选择照片压缩大小
export const QUALITY_SIZE = 94;//图像压缩质量，范围为0 - 100
