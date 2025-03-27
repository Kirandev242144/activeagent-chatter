
/**
 * Utility for playing notification sounds
 */

// Create an audio element for message notifications
const messageAudio = new Audio();
messageAudio.src = "https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3";
messageAudio.preload = "auto";

/**
 * Play a notification sound for new messages
 */
export const playMessageSound = () => {
  try {
    // Reset the audio to the beginning to ensure it plays
    messageAudio.currentTime = 0;
    messageAudio.play().catch(error => {
      // Browser may block autoplay without user interaction
      console.log("Could not play notification sound:", error);
    });
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};
