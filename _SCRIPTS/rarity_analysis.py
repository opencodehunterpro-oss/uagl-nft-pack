# Rarity Analysis Script

import pandas as pd
import matplotlib.pyplot as plt

# Load dataset
def load_data(file_path):
    return pd.read_csv(file_path)

# Analyze rarity
def analyze_rarity(data):
    rarity = data['Attribute'].value_counts()
    return rarity

# Visualize rarity
def visualize_rarity(rarity):
    rarity.plot(kind='bar')
    plt.title('Rarity Analysis')
    plt.xlabel('Attributes')
    plt.ylabel('Counts')
    plt.show()

if __name__ == '__main__':
    data = load_data('data.csv')
    rarity = analyze_rarity(data)
    visualize_rarity(rarity)