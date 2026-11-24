#ifndef OB64_GAME_BOOT_SLOT_PAYLOAD_H
#define OB64_GAME_BOOT_SLOT_PAYLOAD_H
/* Allocated as n+6 bytes: kind at0, payload lengths at2 and4, data at6. */
typedef struct BootStateSlotPayload {
    unsigned char unused_00[2];
    unsigned short payload_size_02;
} BootStateSlotPayload;
void func_00008564(BootStateSlotPayload *payload, const void *source);
#endif
