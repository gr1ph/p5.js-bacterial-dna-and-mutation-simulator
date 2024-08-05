import pygame
import random
import math

# Initialize Pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
DNA_BASES = ["A", "T", "C", "G"]
BACTERIA_COUNT = 10

# Colors
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)

# Screen setup
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Bacteria Simulation")

# Bacterium class
class Bacterium:
    def __init__(self):
        self.position = pygame.Vector2(random.uniform(0, WIDTH), random.uniform(0, HEIGHT))
        self.velocity = pygame.Vector2(random.uniform(-1, 1), random.uniform(-1, 1))
        self.dna = self.generate_dna(50)
        self.size = 20
        self.limbs = 0
        self.speed = 1

    def generate_dna(self, length):
        return ''.join(random.choice(DNA_BASES) for _ in range(length))

    def mutate(self):
        mutation_type = random.choice(["grow", "speed", "limb"])
        if mutation_type == "grow":
            self.size += 5
        elif mutation_type == "speed":
            self.speed += 0.5
        elif mutation_type == "limb":
            self.limbs += 1

    def move(self):
        self.position += self.velocity * self.speed
        if self.position.x < 0 or self.position.x > WIDTH:
            self.velocity.x *= -1
        if self.position.y < 0 or self.position.y > HEIGHT:
            self.velocity.y *= -1
        if random.random() < 0.01:
            self.mutate()

    def draw(self, screen):
        pygame.draw.circle(screen, GREEN, (int(self.position.x), int(self.position.y)), self.size)
        for i in range(self.limbs):
            angle = 2 * math.pi / self.limbs * i
            x = self.position.x + math.cos(angle) * self.size
            y = self.position.y + math.sin(angle) * self.size
            pygame.draw.circle(screen, GREEN, (int(x), int(y)), self.size // 2)

# Create bacteria
bacteria = [Bacterium() for _ in range(BACTERIA_COUNT)]

# Main loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mouse_x, mouse_y = pygame.mouse.get_pos()
            for bacterium in bacteria:
                distance = math.hypot(mouse_x - bacterium.position.x, mouse_y - bacterium.position.y)
                if distance < bacterium.size:
                    print("DNA Sequence:", bacterium.dna)

    screen.fill(WHITE)
    for bacterium in bacteria:
        bacterium.move()
        bacterium.draw(screen)

    pygame.display.flip()
    pygame.time.delay(30)

pygame.quit()
