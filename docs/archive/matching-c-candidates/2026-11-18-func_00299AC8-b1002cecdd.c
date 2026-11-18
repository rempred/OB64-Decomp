typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

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
    u8 pad15;
    u16 field16;
    s16 field18;
    u8 pad1A[8];
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

typedef struct CardMatrix {
    u32 words[16];
} CardMatrix;

typedef struct CombatDrawVertex {
    s16 x;
    s16 y;
    s16 field_04;
    u16 field_06;
    s16 u;
    s16 v;
    u8 field_0C[4];
} CombatDrawVertex;

typedef struct CardGraphics {
    u8 pad00[8];
    CardMatrix *matrices;
    u8 pad0C[4];
    CombatDrawVertex *vertices;
} CardGraphics;

extern Panel *D_8018FDC0;
extern PanelScene *D_8022A974;
extern CardGraphics *D_800E9BE0;
extern u16 D_800C4BE4;
extern u16 D_800E79E0;
extern CardMatrix *D_801969B0;
extern CombatDrawVertex *D_80197178;

extern Panel *func_000552c0(void);
extern Panel *func_0005526c(u16);
extern void func_00056adc(void);
extern void func_00291854(Panel *);

void func_00299AC8(void)
{
    Panel *panel = func_000552c0();
    u8 slot;

    if (panel == 0) {
        return;
    }
    ((u8 *)D_8018FDC0)[0xD2] = 0;
    if (panel->field16 & 4) {
        panel = func_0005526c(0x100);
    }

    slot = 0;
    do {
        PanelSlot *record = D_8022A974->slots[slot];
        u32 key;

        ++slot;
        if (record != 0 && (key = (u32)panel->content) != 0 && (key = ((PanelContent *)key)->key) == (u32)record->key) {
            CardGraphics *graphics = D_800E9BE0;
            u16 matrixCount = D_800C4BE4;
            u16 vertexCount;
            u16 preset;


            D_800C4BE4 = matrixCount + (D_801969B0 - (graphics->matrices + matrixCount));
            vertexCount = D_800E79E0;
            D_800E79E0 = vertexCount + (D_80197178 - (graphics->vertices + vertexCount));

            preset = key & 0xFF;
            func_00056adc();
            {
                CardGraphics *current = D_800E9BE0;
                D_801969B0 = current->matrices + D_800C4BE4;
                D_80197178 = current->vertices + D_800E79E0;
            }

            if (((preset == 6) | (preset == 11)) || preset == 16) {
                s32 count = 0;
                Panel *node = D_8018FDC0->link04;
            nextPanel:
                if (node != 0) {
                    if (node == panel) {
                        func_00291854(node);
                    }
                    node = node->link04;
                    if (++count < 10) {
                        goto nextPanel;
                    }
                }
            }
            break;
        }
    } while (slot < 14);
    ((u8 *)D_8018FDC0)[0xD2] = 1;
}
