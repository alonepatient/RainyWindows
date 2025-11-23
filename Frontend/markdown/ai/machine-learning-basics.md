# 机器学习基础

## 什么是机器学习

机器学习是人工智能的一个分支，它使计算机能够在没有明确编程的情况下学习和改进。

### 机器学习的主要类型

1. **监督学习**
   - 分类问题
   - 回归问题

2. **无监督学习**
   - 聚类分析
   - 降维技术

3. **强化学习**
   - 智能体与环境交互
   - 通过奖励机制学习

## 常用算法

### 线性回归
线性回归用于预测连续值，通过拟合数据点到一条直线。

```python
import numpy as np
from sklearn.linear_model import LinearRegression

# 创建模型
model = LinearRegression()
model.fit(X_train, y_train)

# 预测
predictions = model.predict(X_test)
```

### 决策树
决策树通过树状结构进行决策，易于理解和解释。

```python
from sklearn.tree import DecisionTreeClassifier

# 创建决策树分类器
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)
```

## 评估指标

### 分类问题
- 准确率 (Accuracy)
- 精确率 (Precision)
- 召回率 (Recall)
- F1分数 (F1-Score)

### 回归问题
- 均方误差 (MSE)
- 平均绝对误差 (MAE)
- R²分数 (R-Squared)

## 实践建议

1. **数据预处理**
   - 处理缺失值
   - 特征缩放
   - 编码分类变量

2. **模型选择**
   - 根据问题类型选择算法
   - 考虑计算复杂度
   - 评估模型可解释性

3. **超参数调优**
   - 网格搜索
   - 随机搜索
   - 贝叶斯优化

## 学习资源

- 《机器学习》- 周志华
- 《统计学习方法》- 李航
- Coursera: Machine Learning by Andrew Ng