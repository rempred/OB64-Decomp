#ifndef OB64_GAME_SOUND_CHANNEL_TABLE_H
#define OB64_GAME_SOUND_CHANNEL_TABLE_H
#include "game/sound_channel.h"

/* Descriptor 14's seven resident channel addresses, in their original order. */
extern SoundChannel *D_8022A8A8[7];
/* Existing alias for the sixth slot of that pointer table. */
extern SoundChannel *D_8022A8BC;

void D_800EA6B0(SoundChannel *channel, int id, int fade);
void D_800EA86C(SoundChannel *channel, int param);
void D_800EA89C(SoundChannel *channel, int param);
void D_800EA8B4(SoundChannel *channel, int param);
#endif
