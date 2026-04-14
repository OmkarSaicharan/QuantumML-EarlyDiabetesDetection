
# Early Diabetes Detection using Hybrid Quantum-Classical Machine Learning
This project aims to develop and compare classical and quantum machine learning models for early diabetes detection using the Pima Indians Diabetes Dataset. We will cover the entire pipeline from data loading and preprocessing to model training, evaluation, and visualization, including a hybrid quantum-classical approach.

## 1. DATASET: Pima Indians Diabetes Dataset
We will load the Pima Indians Diabetes Dataset. Since sklearn.datasets does not directly provide this specific dataset under load_diabetes (which is a different one), we'll fetch it from OpenML or a direct URL. For consistency and ease of access, I'll use a widely available direct URL for the CSV.
## 2. DATA PREPROCESSING
This step involves handling missing values, normalizing features, and splitting the dataset into training and testing sets. For the Pima dataset, missing values are often represented as '0' in certain columns (Glucose, BloodPressure, SkinThickness, Insulin, BMI). We will treat these '0's as missing data and impute them.
## 3. CLASSICAL MODELS
We will train two classical machine learning models: Logistic Regression and Random Forest Classifier. For each model, we will evaluate its performance using accuracy, precision, recall, F1-score, and display a confusion matrix.
## 4. QUANTUM MODEL: Variational Quantum Classifier (VQC)
We will build a Variational Quantum Classifier (VQC) using PennyLane. Since the dataset has 8 features and we're using 4 qubits, we will first apply Principal Component Analysis (PCA) to reduce the dimensionality of our features to 4, which is a common practice when the number of features exceeds the number of qubits for AngleEmbedding.

PCA for Dimensionality Reduction
Training VQC for 50 epochs with batch size 32 and learning rate 0.05
Epoch 10/50 | Cost: 0.7932 | Test Accuracy: 0.6753
Epoch 20/50 | Cost: 0.7840 | Test Accuracy: 0.6623
Epoch 30/50 | Cost: 0.7912 | Test Accuracy: 0.6688
Epoch 40/50 | Cost: 0.7988 | Test Accuracy: 0.6818
Epoch 50/50 | Cost: 0.8083 | Test Accuracy: 0.6688

--- Final VQC Evaluation ---
VQC Accuracy: 0.6688
VQC Precision: 0.5366
VQC Recall: 0.4074
VQC F1-score: 0.4632
VQC Confusion Matrix:
[[81 19]
 [32 22]]
 
## 5. HYBRID MODEL (Classical Preprocessing + Quantum Circuit)
The VQC model we just trained inherently represents a hybrid quantum-classical approach because it uses classical preprocessing (scaling and PCA) before feeding the data to the quantum circuit. The training also involves a classical optimizer to update the quantum circuit's parameters. This section confirms the integration.
## 6. EVALUATION: Compare Classical vs. Quantum Models
We will now compare the performance of all trained models (Logistic Regression, Random Forest, and VQC) using various metrics and visualizations.
--- Model Comparison Table ---
Model	Accuracy	Precision	Recall	F1-score
0	Logistic Regression	0.6948	0.5778	0.4815	0.5253
1	Random Forest	0.7792	0.7083	0.6296	0.6667
2	VQC	0.6688	0.5366	0.4074	0.4632

# BONUS: Model Saving and Example Prediction
We will save the best performing classical model (based on accuracy) using joblib and then demonstrate an example prediction using that saved model.
Best classical model 'random_forest_model.joblib', scaler, and imputer saved successfully.

--- Example Prediction ---
Sample Input: [  6.    148.     72.     35.      0.     33.6     0.627  50.   ]
Predicted Outcome (0=No Diabetes, 1=Diabetes): 1
Prediction Probability for Diabetes: 0.8600

Note: For VQC, direct 'joblib' saving and loading is not standard. It requires saving circuit parameters and recreating the QNode.
VQC Prediction for Sample Input: 1
VQC Prediction Raw Output (scaled -1 to 1): 0.4793














 
