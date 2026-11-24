#include "game/boot_slot_payload.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;


extern void func_00023460(void *destination, const void *source, unsigned int length);
extern void *func_000016C4(void *pointer);

void func_00008564(BootStateSlotPayload *payload, const void *source)
{
    register u32 zero asm("$0");
    BootStateSlotPayload *record;

    record = (BootStateSlotPayload *)((u32)payload + zero);
    if (record != 0) {
        func_00023460((u8 *)record + 6, source, record->payload_size_02);
        func_000016C4((void *)((u32)record + zero));
    }
}
