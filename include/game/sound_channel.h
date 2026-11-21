#ifndef OB64_GAME_SOUND_CHANNEL_H
#define OB64_GAME_SOUND_CHANNEL_H

/* Keep the anonymous channel type compatible with the resident services. */
typedef struct {
    signed int unk00;
    signed int request;
    signed int command;
    signed int fade;
    unsigned char unk10[0x14];
    signed int handle;
    signed int unk28;
    signed int saved[3];
    signed int unk38;
    signed int param;
    unsigned char unk40[0xC];
    signed int pending;
} SoundChannel;

#endif
