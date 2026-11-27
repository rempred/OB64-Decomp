#include "game/title_image_header.h"
void func_0028752C(TitleImageHeader *s, s32 a, s32 b, s32 c, s32 d, s32 e, s32 f);
void func_0028752C(TitleImageHeader *img, s32 s, s32 t, s32 w, s32 h, s32 x, s32 y);
void func_002878C0(TitleImageHeader *s, s32 a, s32 b) {
    func_0028752C(s, 0, 0, s->width, s->height, a, b);
}
