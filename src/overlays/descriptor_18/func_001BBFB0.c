#include "overlays/descriptor_18_script_records.h"

typedef struct { u8 b[0x76]; } ScriptObj;
extern ScriptObj D_8022A2E8[];
void bzero(void *p, s32 size);
u8 *func_001BBFB0(s32 i) {
    ScriptObj *o = &D_8022A2E8[i];
    bzero(o, sizeof(ScriptObj));
    return o->b;
}
