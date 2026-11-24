#ifndef GAME_IMAGE_1F_VIEW_H
#define GAME_IMAGE_1F_VIEW_H
typedef struct {
    unsigned char unk0[4];
    unsigned short w;
    unsigned short h;
} Size1F;
void func_001F8DDC(Size1F *image, int s, int t, int w, int h, int x, int y);
void D_801B594C(Size1F *image, int s, int t, int w, int h, int x, int y);
#endif
