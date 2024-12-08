<template>
  <teleport to="body">
      <div class="popup-overlay animate__animated animate__fadeIn" v-if="isVisible">
        <div class="popup animate__animated animate__zoomIn animate__faster">
          <div class="popup__header">
            <h3>{{ title }}</h3>
            <button
              @click="onCancel"
              class="popup__close-button"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
          <div class="popup__body">
            <p>{{ message }}</p>
            <div v-if="type === 'prompt'" class="popup__input-container">
              <input
                fade-model="userInput"
                class="popup__input"
                placeholder="Введите текст"
              />
            </div>
          </div>
          <div class="popup__footer">
            <button
              @click="onConfirm"
              class="popup__button popup__button--confirm"
            >
              ОК
            </button>
            <button
              @click="onCancel"
              class="popup__button popup__button--cancel"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onBeforeUnmount } from "vue";

const props = defineProps({
  title: String,
  message: String,
  type: String,
});

const emit = defineEmits(["confirm", "cancel"]);

const isVisible = ref(false);
const userInput = ref("");

const show = () => {
  disableScrollingAndTabbing();
  isVisible.value = true;
};

const hide = () => {
  enableScrollingAndTabbing();
  isVisible.value = false;
};

const onConfirm = () => {
  if (props.type === "prompt") {
    emit("confirm", userInput.value);
  } else {
    emit("confirm", true);
  }
  hide();
};

const onCancel = () => {
  emit("cancel");
  hide();
};

const disableScrollingAndTabbing = () => {
  document.body.style.overflow = "hidden";

  const elements = document.querySelectorAll(
    "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );
  elements.forEach((element) => {
    (element as HTMLElement).tabIndex = -1;
  });
};

const enableScrollingAndTabbing = () => {
  document.body.style.overflow = "";

  const elements = document.querySelectorAll(
    "a, button, input, select, textarea, [tabindex='-1']"
  );
  elements.forEach((element) => {
    (element as HTMLElement).tabIndex = 0;
  });
};

show();
onBeforeUnmount(() => {
  enableScrollingAndTabbing();
});
</script>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .popup__close-button {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #aaa;

      &:hover {
        color: #000;
      }
    }
  }

  &__body {
    margin: 20px 0;
  }

  &__input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;

    &-container {
      margin-top: 10px;
    }
  }

  &__footer {
    text-align: right;
  }

  &__button {
    padding: 8px 16px;
    margin-left: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &--confirm {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    &--cancel {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
