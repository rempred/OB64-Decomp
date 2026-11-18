#ifndef OB64_GAME_CUTSCENE_PANELS_H
#define OB64_GAME_CUTSCENE_PANELS_H

#include "common/types.h"

typedef struct PanelContent {
    u8 pad000[0x5F1];
    u8 field5F1;
    u8 pad5F2[2];
    u8 field5F4;
    u8 field5F5;
    u8 field5F6;
    u8 pad5F7[5];
    u8 field5FC;
    u8 pad5FD[3];
    s32 key;
} PanelContent;

typedef struct Panel {
    struct Panel *link00;
    struct Panel *link04;
    u8 pad08[0xC];
    u8 flags;
    u8 pad15[0xD];
    u8 field22;
    u8 field23;
    s8 field24;
    u8 field25;
    u8 pad26[0x1A];
    s32 field40;
    u8 pad44[4];
    s32 field48;
    u8 pad4C[0x84];
    PanelContent *content;
} Panel;

typedef struct PanelSlot {
    s32 key;
    void *field04;
    void *field08;
    Panel *panel;
    void *field10;
    s16 status;
    u8 pad16[2];
} PanelSlot;

typedef struct PanelScene {
    u8 pad0000[0x19B8];
    PanelSlot *slots[14];
} PanelScene;

extern PanelScene *D_8022A974;
extern Panel *D_8018FDC0;

typedef void (*PanelCallback)(Panel *, s32);

void func_00297CC8(s32 slot, s32 preset);
void func_00283748(s32 slot);
s32 func_002836C8(s32 slot);
void func_00297644(Panel *panel, s32 index);
void func_002978F4(Panel *panel, s32 index);

#endif
