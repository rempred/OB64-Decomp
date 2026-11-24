#ifndef GAME_CAMERA_F63_VIEW_H
#define GAME_CAMERA_F63_VIEW_H
typedef struct {
    float fov;
    unsigned char unk04[0x10];
    float eye[3];
    float at[3];
    float up[3];
} CamF63;
int func_000f7b70(CamF63 *camera, float x, float y, float *out);
int D_801AAE10(CamF63 *camera, float x, float y, float *out);
#endif
