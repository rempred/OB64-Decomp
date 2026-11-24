#ifndef OB64_GAME_BOOT_STATE_SLOT_CALLBACKS_H
#define OB64_GAME_BOOT_STATE_SLOT_CALLBACKS_H

/* The boot slot walkers pass the slot index to setup, update, draw and exit. */
typedef void (*BootStateSlotCallback)(int slot);

#endif
