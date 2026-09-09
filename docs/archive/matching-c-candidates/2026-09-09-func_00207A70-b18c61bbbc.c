#include "game/combat_pose_pool.h"

void func_00207A70(void)
{
    int slot;
    u32 i;
    int j;

    if (D_801D0728 != 0) {
        for (slot = 0; slot < 20; slot++) {
            for (i = 0; i < D_801D0728[slot].field_18; i++) {
                if (D_801D0728[slot].field_38[i] != 0) {
                    func_000016C4(D_801D0728[slot].field_38[i]);
                    D_801D0728[slot].field_38[i] = 0;
                }
                if (D_801D0728[slot].field_3C[i] != 0) {
                    func_000016C4(D_801D0728[slot].field_3C[i]);
                    D_801D0728[slot].field_3C[i] = 0;
                }
                if (D_801D0728[slot].field_40[i] != 0) {
                    func_000016C4(D_801D0728[slot].field_40[i]);
                    D_801D0728[slot].field_40[i] = 0;
                }
            }
            for (j = 0; j < 10; j++) {
                if (D_801D0728[slot].field_70[j] != 0) {
                    func_000016C4(D_801D0728[slot].field_70[j]);
                    D_801D0728[slot].field_70[j] = 0;
                }
            }
        }
    }
}
