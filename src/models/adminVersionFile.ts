//管理员app版本信息对象
export class AdminVersionFileModel {
  public id: string;//app版本信息对象id
  public versionNo: string;//版本号
  public versionInfo: string;//版本信息
  public forceUpdateState: boolean;//强制更新状态值（0：不强制更新，1：强制更新）
  public versionReleaseState: boolean;//版本发布状态值（0：旧版本，1：新版本）
  public appDownloadUrl: string;//app下载地址
  public versionReleaseDate: string;//版本发布日期
}
