#include "overlays/descriptor_18_script_records.h"

typedef struct { u8 b[0x76]; } ScriptObj;
extern ScriptObj D_8022A2E8[];
u8 *func_001BBFFC(s32 i) {
    return D_8022A2E8[i].b;
}
