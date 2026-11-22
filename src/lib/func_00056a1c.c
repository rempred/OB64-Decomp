#include "game/cutscene_panels.h"

void func_00056a1c(Panel *panel, s16 x0, s16 y0, s16 x1, s16 y1) {
    s32 cx = 160;
    s32 cy = 120;
    s16 sw = (x1 - x0 > 0 ? x1 - x0 : x0 - x1) - 1;
    s16 sh = (y1 - y0 > 0 ? y1 - y0 : y0 - y1) - 1;
    panel->vertices[0].x = cx - x1;
    panel->vertices[0].y = cy - y1;
    panel->vertices[0].u = 0;
    panel->vertices[0].v = sh << 6;
    panel->vertices[1].x = cx - x1;
    panel->vertices[1].y = cy - y0;
    panel->vertices[1].u = 0;
    panel->vertices[1].v = 0;
    panel->vertices[2].x = cx - x0;
    panel->vertices[2].y = cy - y0;
    panel->vertices[2].u = sw << 6;
    panel->vertices[2].v = 0;
    panel->vertices[3].x = cx - x0;
    panel->vertices[3].y = cy - y1;
    panel->vertices[3].u = sw << 6;
    panel->vertices[3].v = sh << 6;
}
