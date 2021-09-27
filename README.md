# 前端监控
## 监控分类
- 1)性能监控
- 2)数据监控
- 3)异常监控

## 为什么需要前端监控
- 获取用户行为以及跟踪产品在用户端的使用情况，并以监控数据为基础，指明产品优化的方向。

## 前端性能监控和错误监控
- 前端衡量性能的指标（时间监控）
  - Resource timing Performance API
- 前端资源监控
  - performance.getEntriesByType('resource');
- ajax请求监控
  - 拦截open和send方法
- 前端代码异常
  - window.onerroe    