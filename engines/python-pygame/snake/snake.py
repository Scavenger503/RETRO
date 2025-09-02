import pygame as pg, random

TILE = 20
GRID_W, GRID_H = 24, 18
W, H = GRID_W*TILE, GRID_H*TILE
FPS = 12

pg.init()
screen = pg.display.set_mode((W, H))
pg.display.set_caption("RETRO — Snake (Pygame)")
clock = pg.time.Clock()
font = pg.font.SysFont("consolas", 18)

def draw_rect(color, cell):
  x, y = cell
  pg.draw.rect(screen, color, (x*TILE, y*TILE, TILE, TILE))

def spawn_food(snake):
  cells = {(x, y) for x in range(GRID_W) for y in range(GRID_H)}
  free = list(cells - set(snake))
  return random.choice(free)

def main():
  snake = [(GRID_W//2, GRID_H//2)]
  direction = (1, 0)  # start moving right
  food = spawn_food(snake)
  score = 0
  running = True

  while running:
    for e in pg.event.get():
      if e.type == pg.QUIT: running = False
      elif e.type == pg.KEYDOWN:
        if e.key in (pg.K_UP, pg.K_w)   and direction != (0, 1): direction = (0, -1)
        if e.key in (pg.K_DOWN, pg.K_s) and direction != (0,-1): direction = (0, 1)
        if e.key in (pg.K_LEFT, pg.K_a) and direction != (1, 0): direction = (-1, 0)
        if e.key in (pg.K_RIGHT, pg.K_d)and direction != (-1,0): direction = (1, 0)
        if e.key == pg.K_r:
          snake[:] = [(GRID_W//2, GRID_H//2)]; direction = (1,0); score = 0; food = spawn_food(snake)

    # advance snake
    head = (snake[0][0] + direction[0], snake[0][1] + direction[1])
    # wrap around edges (classic)
    head = (head[0] % GRID_W, head[1] % GRID_H)

    if head in snake:  # self-collision -> reset
      snake[:] = [(GRID_W//2, GRID_H//2)]
      direction = (1,0); score = 0; food = spawn_food(snake)
    else:
      snake.insert(0, head)
      if head == food:
        score += 1
        food = spawn_food(snake)
      else:
        snake.pop()

    # draw
    screen.fill((0,0,0))
    # grid (subtle)
    for x in range(GRID_W): pg.draw.line(screen, (25,25,25), (x*TILE,0), (x*TILE,H))
    for y in range(GRID_H): pg.draw.line(screen, (25,25,25), (0,y*TILE), (W,y*TILE))
    for cell in snake: draw_rect((0,200,0), cell)
    draw_rect((200,50,50), food)
    text = font.render(f"Score: {score}  (R to reset)", True, (255,255,255))
    screen.blit(text, (8, 8))

    pg.display.flip()
    clock.tick(FPS)

  pg.quit()

if __name__ == "__main__":
  main()
