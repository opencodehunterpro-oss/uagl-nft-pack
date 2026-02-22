import random
import string
import matplotlib.pyplot as plt
from wordcloud import WordCloud

# Function to generate random words
def generate_random_words(num_words):
    words = [''.join(random.choices(string.ascii_lowercase, k=random.randint(3, 8))) for _ in range(num_words)]
    return ' '.join(words)

# Function to create and save a word cloud
def create_word_cloud():
    text = generate_random_words(200)
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.savefig('_SCRIPTS/wordcloud.png')
    plt.show()

if __name__ == '__main__':
    create_word_cloud()