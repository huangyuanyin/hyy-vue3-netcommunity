// UTC时间转为北京时间 '2022-09-16T17:44:08Z' => '2022/9/16 16:43:40'
export const utc2beijing = utc_datetime => {
  return new Date(utc_datetime).toLocaleString().replace(/\//g, '-')
}
