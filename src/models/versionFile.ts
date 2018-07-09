//app版本信息对象
export class VersionFileModel {
  public id: string;//app版本信息对象id
  public versionNo: string;//版本号
  public versionInfo: string;//版本信息
  public updateDate: string;//版本更新日期
  public latestVersionNo: string;//最新版本号
  public latestVersionInfo: string;//最新版本信息
  public latestUpdateDate: string;//最新版本更新日期
  public appDownloadUrl: string;//app下载地址
  public forceUpdateState: number;//强制更新状态值（0：不强制更新，1：强制更新）
}
