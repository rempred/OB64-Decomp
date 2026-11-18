#include "common/types.h"
#include "game/combat_draw.h"

typedef struct PanelParameters {
    u16 *field00;
    u8 *field04;
    void *field08;
    void *field0C;
    void *field10;
    void *field14;
    u16 field18;
    u16 field1A;
    u16 field1C;
    u8 pad1E[2];
    u16 field20;
    u16 field22;
    u8 pad24[0x41];
    u8 field65;
    u8 field66;
    u8 field67;
} PanelParameters;

typedef struct CardMatrix {
    u32 words[16];
} CardMatrix;

typedef struct CardGraphics {
    u8 pad00[8];
    CardMatrix *matrices;
    u8 pad0C[4];
    CombatDrawVertex *vertices;
} CardGraphics;

extern volatile u8 D_800A81F0;
extern CardGraphics *D_800E9BE0;
extern volatile u16 D_800C4BE4;
extern u16 D_800E79E0;
extern u8 D_8022A996;
extern CardMatrix *D_801969B0;
extern CombatDrawVertex *D_80197178;
extern PanelParameters *D_8023DE34;

extern u8 func_00042c30(void);
extern void func_0028B504(void);
extern void func_0028B7A4(void);
extern void func_002908CC(void *image);
extern void func_00299AC8(void);

void func_0028af64(void)
{
    {
        u8 renderState = D_800A81F0;
        volatile CardGraphics *graphics = D_800E9BE0;
        u16 vertexCount = D_800E79E0;
        u16 matrixCount;
        CardMatrix *matrices;
        CombatDrawVertex *vertices;

        D_8022A996 = renderState;
        matrixCount = D_800C4BE4;
        matrices = graphics->matrices;
        vertices = graphics->vertices;
        D_801969B0 = matrices + matrixCount;
        D_80197178 = vertices + vertexCount;
    }

    if (func_00042c30() != 0) {
        func_0028B504();
        func_0028B7A4();
    } else {
        PanelParameters *parameters = D_8023DE34;

        if (parameters->field66 != 2 && parameters->field14 != 0) {
            func_002908CC(parameters->field14);
        }
    }
    func_00299AC8();

    {
        CardGraphics *graphics = D_800E9BE0;
        u16 matrixCount = D_800C4BE4;
        u16 vertexCount;

        D_800C4BE4 = matrixCount + (D_801969B0 - (graphics->matrices + matrixCount));
        vertexCount = D_800E79E0;
        D_800E79E0 = vertexCount + (D_80197178 - (graphics->vertices + vertexCount));
    }
}
