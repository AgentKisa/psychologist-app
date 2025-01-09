import * as React from "react";
import Modal from "react-modal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./AppointmentModal.module.css";
import TimePicker from "./TimePicker";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  phone: yup
    .string()
    .matches(/^\+380\d{9}$/, "Phone must be in format +380XXXXXXXXX")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  time: yup.mixed().required("Meeting time is required"),
  comment: yup.string().required("Comment is required"),
});

Modal.setAppElement(document.body);

const AppointmentModal = ({ psychologist, onClose, isOpen }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      time: null,
      comment: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    onClose();
  };

  if (!psychologist) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        console.log("onRequestClose вызван!"); // Проверяем, вызывается ли функция
        onClose();
      }}
      className={styles.modal}
      appElement={document.body}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick={true}
    >
      <div className={styles.modalContent}>
        <h2>Make an appointment with a psychologists</h2>
        <p className={styles.description}>
          You are on the verge of changing your life for the better. Fill out
          the short form below to book your personal appointment with a
          professional psychologist. We guarantee confidentiality and respect
          for your privacy.
        </p>
        <div className={styles.psychologistInfo}>
          <img src={psychologist.avatar_url} alt={psychologist.name} />
          <div className={styles.psychologistInfoContent}>
            <p className={styles.psychologistName}>Your psychologists</p>
            <strong>{psychologist.name}</strong>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className={styles.inputPfone}
            type="text"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          <div className={styles.timePhoneContainer}>
            <div className={styles.validationContainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="+380"
                {...register("phone")}
              />
              {errors.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}
            </div>

            <Controller
              name="time"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className={styles.timePhoneContainer}>
                  <div className={styles.validationContainer}>
                    <TimePicker value={value} onChange={onChange} />
                    {errors.time && (
                      <p className={styles.error}>{errors.time.message}</p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          <textarea
            className={styles.textarea}
            placeholder="Comment"
            {...register("comment")}
          />
          {errors.comment && (
            <p className={styles.error}>{errors.comment.message}</p>
          )}

          <button className={styles.submitButton} type="submit">
            Send
          </button>
        </form>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="32" height="32">
            <use href="/sprite.svg#icon-x"></use>
          </svg>
        </button>
      </div>
    </Modal>
  );
};

export default AppointmentModal;
