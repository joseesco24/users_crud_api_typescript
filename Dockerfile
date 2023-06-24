# ---------------------------------------------------------------------------------------------------------------------
# ** info: stage 1: building stage
# ---------------------------------------------------------------------------------------------------------------------

# ** info: declaration of the building image base version
FROM node:18.15.0 as building

# ** info: declaration of the building image working directory
ARG WORKDIR=/home/building

# ** info: creating the building image working directory
RUN mkdir -p $WORKDIR

# ** info: establishing the default working directory
WORKDIR $WORKDIR

# ** info: copying the requirements files from the building context to the working directory
COPY ["package-lock.json" ,"$WORKDIR/"]
COPY ["tsconfig.json" ,"$WORKDIR/"]
COPY ["package.json" ,"$WORKDIR/"]

# ** info: installing the dependencies and latest npm version
RUN npm ci --only=production && npm cache clean --force

# ** info: validating dependencies integrity
RUN npm audit

# ** info: copying the source code of the application from the building context to the working directory
COPY ["src", "$WORKDIR/src"]

# ** info: running the application tests
RUN npm run test

# ** info: removing the typescript testing files
RUN find . | grep -E "(/.spec.ts$|/.spec.js$)" | xargs rm -rf

# ** info: building the app
RUN npm run build

# ---------------------------------------------------------------------------------------------------------------------
# ** stage 2: production image
# ---------------------------------------------------------------------------------------------------------------------

# ** info: declaration of the production image base version
FROM node:18.15.0-alpine3.17

# ** info: declaration of the production working directory and username inside the production image
ARG USERNAME=production
ARG WORKDIR=/home/$USERNAME

# ** info: creating the user on bash and their home directory (working directory)
RUN adduser -h $WORKDIR -s /bin/ash -D $USERNAME

# ** info: copying the app requirements file from the building image
COPY --from=building ["/home/building/package-lock.json","$WORKDIR/"]
COPY --from=building ["/home/building/package.json","$WORKDIR/"]

# ** info: changing the premises of the working directory
RUN chown -R $USERNAME $WORKDIR

RUN find "$WORKDIR/" -type d -exec chmod 555 {} \;
RUN find "$WORKDIR/" -type f -exec chmod 555 {} \;

RUN chmod 555 $WORKDIR

# ** info: establishing the default working directory inside the production image
WORKDIR $WORKDIR

# ** info: installing the dependencies and latest npm version
RUN npm ci --only=production && npm cache clean --force

# ** info: validating dependencies integrity
RUN npm audit

# ** info: copying source code of the application from the building image
COPY --from=building ["/home/building/dist", "$WORKDIR/dist"]

# ** info: removing the typescript testing files
RUN find . | grep -E "(/.spec.ts$|/.spec.js$)" | xargs rm -rf

# ** info: removing the app requirements file
RUN rm -r package-lock.json
RUN rm -r package.json

# ** info: establishing the default user inside the production image
USER $USERNAME

# ** info: executing the app
ENTRYPOINT ["node", "dist/main.js"]