#include "common/types.h"
#include "game/combat_draw.h"
typedef struct CombatDrawCommand { u32 first, second; } CombatDrawCommand;
extern CombatDrawCommand * volatile D_800E9BA0;

typedef struct CardMatrix {
    u32 words[16];
} CardMatrix;

typedef struct CardGraphics {
    u8 pad00[8];
    CardMatrix *matrices;
    u8 pad0C[4];
    CombatDrawVertex *vertices;
} CardGraphics;

extern CardGraphics *D_800E9BE0;
extern volatile u8 D_800A81F0;
extern volatile u16 D_800C4BE4;
extern u16 D_800E79E0;
extern u8 D_8022A996;
extern CombatDrawCommand D_8022AA40[];
extern u16 D_8018F1A0;
extern CardMatrix *D_801969B0;
extern CombatDrawVertex *D_80197178;

extern void func_00289780(void);
extern void func_00287AA4(void);
extern void func_00289558(void);

void func_0028A534(void)
{
    {
        CardGraphics *graphics = D_800E9BE0;
        u8 renderState = D_800A81F0;
        u16 matrixCount = D_800C4BE4;
        CombatDrawCommand *command = D_800E9BA0;
        CardMatrix *matrices = graphics->matrices;
        CombatDrawVertex *vertices = graphics->vertices;
        u16 vertexCount;
        u16 selector;
        s32 variant;

        D_800E9BA0 = command + 1;
        command->first = 0xDE000000;
        command->second = (u32)D_8022AA40;

        vertexCount = D_800E79E0;
        selector = D_8018F1A0;
        matrices += matrixCount;
        D_8022A996 = renderState;
        vertices += vertexCount;
        variant = selector - 1073;
        D_801969B0 = matrices;
        D_80197178 = vertices;

        if (variant != 5) {
            func_00289780();
        } else {
            CombatDrawCommand *sync;

            func_00287AA4();
            sync = D_800E9BA0;
            D_800E9BA0 = sync + 1;
            sync->first = 0xE7000000;
            sync->second = 0;
            func_00289558();
        }
    }

    {
        CardGraphics *graphics = D_800E9BE0;
        u16 matrixCount = D_800C4BE4;
        u16 vertexCount;

        D_800C4BE4 = matrixCount + (D_801969B0 - (graphics->matrices + matrixCount));
        vertexCount = D_800E79E0;
        D_800E79E0 = vertexCount + (D_80197178 - (graphics->vertices + vertexCount));
    }
}
