const Privacy = () => {
  return (
    <>
      <p>
        <strong>Política de Privacidad</strong>
      </p>

      <p>
        <em>Actualizado: [Fecha]</em>
      </p>

      <p>
        <strong>1. Introducción</strong>
      </p>
      <p>
        Bienvenido a <span>Chatbot</span> (nosotros, nuestro o nos). Tu
        privacidad es importante para nosotros. Esta Política de Privacidad
        explica cómo manejamos tus datos cuando usas nuestra aplicación.
      </p>

      <p>
        <strong>2. Información que Recopilamos</strong>
      </p>
      <p>
        No recopilamos ni almacenamos información personal de los usuarios. La
        autenticación se gestiona a través de <span>Clerk</span>, y los mensajes
        se almacenan temporalmente en <span>Supabase</span> para mejorar la
        experiencia de uso.
      </p>

      <p>
        <strong>3. Uso de los Datos</strong>
      </p>
      <ul>
        <li>
          Utilizamos <span>Clerk</span> para una autenticación segura.
        </li>
        <li>
          Los mensajes se almacenan en <span>Supabase</span>, pero no de forma
          permanente.
        </li>
        <li>
          No almacenamos ningún dato en el almacenamiento local del dispositivo.
        </li>
      </ul>

      <p>
        <strong>4. Compartición de Datos</strong>
      </p>
      <ul>
        <li>No vendemos, alquilamos ni compartimos tus datos con terceros.</li>
        <li>
          Los mensajes procesados en la aplicación pueden enviarse a la API de{" "}
          <span>OpenAI ChatGPT</span> para generar respuestas, pero no retenemos
          ni analizamos esta información.
        </li>
      </ul>

      <p>
        <strong>5. Seguridad de los Datos</strong>
      </p>
      <p>
        Tomamos medidas razonables para proteger tus datos, utilizando
        autenticación segura y bases de datos cifradas. Sin embargo, ninguna
        transmisión por internet es 100% segura.
      </p>

      <p>
        <strong>6. Tus Opciones</strong>
      </p>
      <ul>
        <li>
          Puedes gestionar tu cuenta a través de <span>Clerk</span>.
        </li>
        <li>
          Si deseas eliminar tus mensajes, puedes hacerlo desde la aplicación.
        </li>
      </ul>

      <p>
        <strong>7. Cambios en la Política de Privacidad</strong>
      </p>
      <p>
        Podemos actualizar esta política ocasionalmente. Cualquier cambio se
        publicará aquí y el uso continuo de la aplicación implicará la
        aceptación de la versión actualizada.
      </p>

      <p>
        <strong>8. Contacto</strong>
      </p>
      <p>
        Si tienes alguna pregunta sobre esta Política de Privacidad, puedes
        contactarnos en <span>[Tu Correo Electrónico de Contacto]</span>.
      </p>
    </>
  );
};

export default Privacy;
