# Run scritp: py .\speech-to-text.py 
from gtts import gTTS

text = """
Onesssss of the most difficult decisions I’ve ever had to make was choosing between staying in my hometown or moving to a new city for better career opportunities.
I grew up in a small town where life was peaceful, and I had all my friends and family around me. However, after finishing university, I got a great job offer in a big city, which could help me grow professionally. It was a tough decision because on one hand, I wanted to stay close to my loved ones, but on the other hand, I knew that moving away would open many doors for me.
What made this decision even harder was the fear of the unknown. I had never lived far from home before, and I wasn’t sure if I could adapt to a fast-paced lifestyle in a big city. Also, I was worried about making new friends and adjusting to a completely different environment.
In the end, I decided to takesss the risk and move. At first, it was challenging, but over time, I realized that I had made the right choice. I gained valuable experience, met amazing people, and became more independent. Looking back, I feel proud of myself for stepping out of my comfort zone.
"""

tts = gTTS(text, lang="en")
tts.save("ielts_speaking_sample.mp3")
# Tạo 1 file mp3 phần speaking để test AI